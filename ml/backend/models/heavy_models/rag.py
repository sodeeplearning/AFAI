import os
import requests
from tqdm import tqdm


from huggingface_hub import hf_hub_download
from langchain_huggingface import HuggingFaceEmbeddings

from langchain.agents import initialize_agent, Tool, AgentType
from langchain.memory import ConversationBufferMemory
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_community.llms import LlamaCpp
from langchain_community.document_loaders import UnstructuredFileLoader
from langchain_community.vectorstores import FAISS\

from langchain_graph_retriever.transformers import ShreddingTransformer
from langchain_graph_retriever import GraphRetriever
from graph_retriever.strategies import Eager


from models.models_config import default_saving_path


class BaseRAG:
    """Class made for base tasks about documents (RAG)."""
    def __init__(
            self,
            repo_id: str = "mradermacher/T-lite-it-1.0-i1-GGUF",
            filename: str = "T-lite-it-1.0.i1-Q4_K_M.gguf",
            saving_path: str = default_saving_path,
            context_size: int = 8192,
            k: int = 3
    ):
        """Constructor of BaseRAG class.

        :param repo_id: Model's repo name.
        :param filename: Local file path / name of repo file.
        :param saving_path: Path where model will be stored.
        :param context_size: Max context size (memory of the model).
        :param k: Num of search results.
        """
        self.k = k

        self.saving_path = os.path.join(saving_path, repo_id)
        self.messages = []

        model_path = hf_hub_download(
            repo_id=repo_id,
            filename=filename,
            cache_dir=self.saving_path,
        )

        self.llm = LlamaCpp(
            model_path=model_path,
            n_ctx=context_size,
            max_tokens=context_size // 8
        )

        self.embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

        self.splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)

        self.db = None
        self.retriever = None

        tools = [
            Tool(
                name="Retriever",
                func=self.__retrieve,
                description="If model doesn't know the answer, it can retrieve information from database if it exists"
            ),
            Tool(
                name="WebSearch",
                func=self.__duckduckgo_search,
                description="Searching relevant information in internet. Use if no relevant information from Retriever"
            ),
            Tool(
                name="Datetime",
                func=self.__get_time,
                description="Get date and time from name of the city."
            ),
            Tool(
                name="Weather",
                func=self.__get_weather,
                description="Get information about weather in the requested city."
            ),
            Tool(
                name="Python Execution",
                func=self.__execute_python_code,
                description="Execute python code. Give code to it without any strings with 'import'!"
            )
        ]

        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            human_prefix="user",
            ai_prefix="assistant",
            return_messages=True
        )

        self.agent = initialize_agent(
            tools=tools,
            llm=self.llm,
            agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
            memory=self.memory,
            verbose=False,
        )


    def save_database(self, path: str):
        """Save database to a local folder.

        :param path: Path to saving folder.
        :return: None
        """
        if self.db is not None:
            self.db.save_local(path)


    def load_database(self, path: str):
        """Load database from local folder.

        :param path: Path to the folder.
        :return: None
        """
        self.db = FAISS.load_local(path, embeddings=self.embedding_model)


    def add_documents(self, new_documents_paths: str | list[str]):
        """Add new documents to database.

        :param new_documents_paths: Path to new documents.
        :return: None
        """
        if isinstance(new_documents_paths, str):
            new_documents_paths = [new_documents_paths]

        all_docs = []

        for path in tqdm(new_documents_paths):
            loader = UnstructuredFileLoader(path)
            documents = loader.load()
            split_docs = self.splitter.split_documents(documents)
            all_docs.extend(split_docs)

        if self.db is None:
            self.db = FAISS.from_documents(all_docs, self.embedding_model)
        else:
            self.db.add_documents(all_docs)


    def clear_documents(self):
        """Clear database."""
        self.db = None


    def clear(self):
        """Clear chat history."""
        self.memory.clear()
        self.messages.clear()


    def __retrieve(self, query: str) -> str:
        """Retrieve information from database (if it exists).

        :param query: Query to search.
        :return: Found data.
        """
        if self.db is None:
            return "Error: Database doesn't contain any files."

        docs = self.db.similarity_search(query, k=self.k)
        return "\n".join([doc.page_content for doc in docs])


    def __duckduckgo_search(self, query: str) -> str:
        """Search information from web.

        :param query: Query to search.
        :return: Found information
        """
        url = "https://api.duckduckgo.com/"
        params = {
            "q": query,
            "format": "json",
            "no_html": 1,
            "skip_disambig": 1
        }
        response = requests.get(url, params=params)
        data = response.json()

        if data.get("AbstractText"):
            return data["AbstractText"]

        elif data.get("RelatedTopics"):
            results = [topic.get("Text") for topic in data["RelatedTopics"] if "Text" in topic]
            return "\n".join(results[:self.k]) if results else "No results."

        else:
            return "Nothing found."


    def __get_weather(self, city):
        """Get information about weather.

        :param city: Get weather from.
        :return: Received information about weather.
        """
        lat, lon = self.__get_coordinates(city.lower())
        if lat is None:
            return f"City '{city}' not found."

        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current_weather": "true"
        }
        response = requests.get(url, params=params)
        data = response.json()
        weather = data.get("current_weather")
        if weather:
            temperature = weather["temperature"]
            windspeed = weather["windspeed"]
            return f"The weather in {city} is {temperature}°C, wind speed is {windspeed} km/h"
        else:
            return "Error while receiving info about weather"


    @staticmethod
    def __get_time(city: str) -> str:
        """Get time in the city.

        :param city: City to get time from.
        :return: Time in the city.
        """
        timezone_lookup = {
            "moscow": "Europe/Moscow",
            "new york": "America/New_York",
            "london": "Europe/London",
            "tokyo": "Asia/Tokyo",
            "berlin": "Europe/Berlin"
        }
        city_lower = city.lower()
        timezone = timezone_lookup.get(city_lower)

        if not timezone:
            return f"I can't find a time in {city}."

        response = requests.get(f"http://worldtimeapi.org/api/timezone/{timezone}")
        data = response.json()

        current_time = data.get("datetime", "Error while receiving time.")
        return f"Time in {city} — {current_time}"


    @staticmethod
    def __get_coordinates(city: str):
        """Get coordinates of city.

        :param city: Get coordinates from.
        :return: Received coordinates.
        """
        url = "https://geocoding-api.open-meteo.com/v1/search"
        params = {"name": city, "count": 1, "language": "en", "format": "json"}

        response = requests.get(url, params=params)
        data = response.json()
        results = data.get("results")

        if results:
            return results[0]["latitude"], results[0]["longitude"]
        else:
            return None, None


    @staticmethod
    def __execute_python_code(code: str) -> str:
        """Execute simple Python code.

        :param code: Code to execute.
        :return: Result of execution.
        """
        try:
            local_vars = {}
            exec(code, {"__builtins__": {}}, local_vars)
            return f"Successful execution. All variables: {local_vars}"

        except Exception as e:
            return f"Error while execution: {str(e)}"


    def __call__(self, prompt: str, *args, **kwargs) -> str:
        """Get answer from the model.

        :param prompt: Input to the model.
        :return: Answer from the model.
        """
        response = self.agent.invoke({"input": prompt})["output"]

        self.messages.extend([
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": response}
        ])

        return response


class GraphRAG(BaseRAG):
    """Class made for processing more complex connections in data."""
    def __init__(
            self,
            repo_id: str = "mradermacher/T-lite-it-1.0-i1-GGUF",
            filename: str = "T-lite-it-1.0.i1-Q4_K_M.gguf",
            saving_path: str = default_saving_path,
            context_size: int = 8192,
            k: int = 3
    ):
        """Constructor of GraphRAG class.

        :param repo_id: Model's repo name.
        :param filename: Local file path / name of repo file.
        :param saving_path: Path where model will be stored.
        :param context_size: Max context size (memory of the model).
        :param k: Num of search results.
        """
        super().__init__(
            repo_id=repo_id,
            filename=filename,
            saving_path=saving_path,
            context_size=context_size,
            k=k
        )


    def add_documents(self, new_documents_paths: str | list[str]):
        """Add new documents to database.

        :param new_documents_paths: Path to new documents.
        :return: None
        """
        if isinstance(new_documents_paths, str):
            new_documents_paths = [new_documents_paths]

        all_docs = []

        for path in tqdm(new_documents_paths):
            loader = UnstructuredFileLoader(path)
            documents = loader.load()
            split_docs = self.splitter.split_documents(documents)
            all_docs.extend(split_docs)

        if self.db is None:
            self.db = FAISS.from_documents(
                documents=list(ShreddingTransformer().transform_documents(all_docs)),
                embedding=self.embedding_model
            )
        else:
            self.db.add_documents(all_docs)

        self.retriever = GraphRetriever(
            store=self.db,
            strategy=Eager(k=self.k, start_k=1, max_depth=3)
        )


    def clear_documents(self):
        """Clear database."""
        self.db = None
        self.retriever = None


    def __retrieve(self, query: str) -> str:
        """Retrieve information from database (if it exists).

        :param query: Query to search.
        :return: Found data.
        """
        if self.db is None:
            return "Error: Database doesn't contain any files."

        results = self.retriever.invoke(query)

        processed_results = [f"{doc.id}: {doc.page_content}" for doc in results]

        return "\n".join(processed_results)

