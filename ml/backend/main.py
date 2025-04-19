from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from config import full_version
from active import update_chathistory_file

import handlers


app = FastAPI()
app.include_router(handlers.router)


@app.on_event("shutdown")
async def shutdown_event():
    update_chathistory_file()


if full_version:
    import fv_handlers
    app.include_router(fv_handlers.router)

origins = [
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

if __name__ == "__main__":
    uvicorn.run(app)
