import os

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
            documents_paths: str | list[str] = "documents.txt",
            repo_id: str = "mradermacher/T-lite-it-1.0-i1-GGUF",
            filename: str = "T-lite-it-1.0.i1-Q4_K_M.gguf",
            saving_path: str = default_saving_path,
            n_ctx: int = 8192
    ):
        self.saving_path = os.path.join(saving_path, repo_id)

        model_path = hf_hub_download(
            repo_id=repo_id,
            filename=filename,
            cache_dir=self.saving_path,
        )

        llm = LlamaCpp(
            model_path=model_path,
            n_ctx=n_ctx,
        )

        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

        loader = UnstructuredFileLoader(documents_paths)
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = splitter.split_documents(documents)

        db = FAISS.from_documents(docs, embedding_model)

        db.add_documents(docs)

        retriever = db.as_retriever(search_kwargs={"k": 3})

        self.rag_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            chain_type="stuff"
        )

    def __call__(self, prompt):
        response = self.rag_chain.invoke(prompt)["result"]
        return response


if __name__ == '__main__':
    model = BaseRAG()
    print(model("Какая статья конституции отвечает за права человека?"))
