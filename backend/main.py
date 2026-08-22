from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from database.mongo_client import get_database

app = FastAPI(
    title="TrueTag - Automated E-Commerce Legal Metrology Portal",
    description="Engineered for SW-10 Hackathon",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
def on_startup():
    get_database()


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "app": "TrueTag E-Commerce Compliance Checker",
        "regulations": "Indian Legal Metrology (Packaged Commodities) Rules, 2011"
    }