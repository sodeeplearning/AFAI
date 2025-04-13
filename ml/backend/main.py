from fastapi import FastAPI
import uvicorn

from config import full_version

import handlers


app = FastAPI()
app.include_router(handlers.router)

if full_version:
    import fv_handlers
    app.include_router(fv_handlers.router)


if __name__ == "__main__":
    uvicorn.run(app)
