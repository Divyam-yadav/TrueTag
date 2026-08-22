import os
import shutil


MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DATABASE_NAME = "True_Tag"
COLLECTION_NAME = "compliance_audits"

SERVER_HOST = "0.0.0.0"
SERVER_PORT = 8000


def get_tesseract_path() -> str:

    if shutil.which("tesseract"):
        return "tesseract"

    standard_windows_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe")
    ]

    for path in standard_windows_paths:
        if os.path.exists(path):
            return path

    return None