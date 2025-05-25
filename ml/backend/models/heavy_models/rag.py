import os
from tqdm import tqdm

from huggingface_hub import hf_hub_download

from langchain.llms import LlamaCpp
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import UnstructuredFileLoader
from langchain_community.vectorstores import FAISS

from models.models_config import default_saving_path


class BaseRAG:
    def __init__(
            self,
            repo_id: str = "mradermacher/T-lite-it-1.0-i1-GGUF",
            filename: str = "T-lite-it-1.0.i1-Q4_K_M.gguf",
            saving_path: str = default_saving_path,
            context_size: int = 8192
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
            max_tokens=context_size
        )

        self.embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

        self.splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

        self.db = None
        self.rag_chain = None

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

        retriever = self.db.as_retriever(search_kwargs={"k": 3})

        self.rag_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=retriever,
            chain_type="stuff"
        )

    def clear_documents(self):
        """Clear database."""
        self.db = None
        self.rag_chain = None


    def __call__(self, prompt: str, *args, **kwargs):
        """Get answer from the model.

        :param prompt: Input to the model.
        :return: Answer from the model.
        """
        if self.rag_chain is None:
            return self.llm(prompt)

        response = self.rag_chain.invoke(prompt)["result"]

        self.messages.extend([
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": response}
        ])

        return response
