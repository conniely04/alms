from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import street, chat
import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(street.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")

uvicorn.run(app)