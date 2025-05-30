import os
import requests
from tqdm import tqdm


from huggingface_hub import hf_hub_download

from langchain.agents import initialize_agent, Tool, AgentType
from langchain.memory import ConversationBufferMemory
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_community.llms import LlamaCpp
from langchain_community.document_loaders import UnstructuredFileLoader
from langchain_community.vectorstores import FAISS


from models.models_config import default_saving_path


class BaseRAG:
    def __init__(
            self,
            repo_id: str = "mradermacher/T-lite-it-1.0-i1-GGUF",
            filename: str = "T-lite-it-1.0.i1-Q4_K_M.gguf",
            saving_path: str = default_saving_path,
            context_size: int = 8192,
    ):
        """Constructor of BaseRAG class.

        :param filename: Local file path / name of repo file.
        :param repo_id: Model's repo name.
        :param context_size: Max context size (memory of the model).
        :param saving_path: Path where model will be stored.
        """
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
            )
        ]

        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

        self.agent = initialize_agent(
            tools=tools,
            llm=self.llm,
            agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
            memory=self.memory,
            verbose=False,
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

        docs = self.db.similarity_search(query, k=3)
        return "\n".join([doc.page_content for doc in docs])


    @staticmethod
    def __duckduckgo_search(query: str) -> str:
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
            return "\n".join(results[:3]) if results else "No results."

        else:
            return "Nothing found."

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
