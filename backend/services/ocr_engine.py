import os
import shutil
import pytesseract
from services.image_processor import preprocess_image_opencv


def auto_configure_tesseract():
    if shutil.which("tesseract"):
        return

    candidates = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe")
    ]
    for candidate in candidates:
        if os.path.exists(candidate):
            pytesseract.pytesseract.tesseract_cmd = candidate
            break


auto_configure_tesseract()


def extract_text_from_image(image_bytes: bytes, filename: str = "image.jpg") -> dict:
    pil_processed, pil_original = preprocess_image_opencv(image_bytes)

    text_processed = ""
    text_original = ""
    tess_config = '--psm 3'

    try:
        text_processed = pytesseract.image_to_string(pil_processed, config=tess_config)
    except Exception:
        pass

    try:
        text_original = pytesseract.image_to_string(pil_original, config=tess_config)
    except Exception:
        pass

    all_lines = list(dict.fromkeys((text_original + "\n" + text_processed).splitlines()))
    clean_text = "\n".join([line.strip() for line in all_lines if line.strip()])

    return {
        "filename": filename,
        "extracted_text": clean_text,
        "char_count": len(clean_text)
    }