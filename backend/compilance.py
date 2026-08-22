import io
import os
import shutil
from PIL import Image
import pytesseract

tesseract_candidates = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe")
]

for candidate in tesseract_candidates:
    if os.path.exists(candidate):
        pytesseract.pytesseract.tesseract_cmd = candidate
        break


def extract_text_from_image(image_bytes: bytes) -> str:

    image = Image.open(io.BytesIO(image_bytes))

    extracted_text = pytesseract.image_to_string(image)
    return extracted_text.strip()


def check_rule_compliance(extracted_text: str) -> dict:

    text_lower = extracted_text.lower()

    mrp_keywords = ["mrp", "m.r.p", "maximum retail price", "max retail price", "incl. of all taxes", "inclusive of all taxes"]
    mrp_found = any(keyword in text_lower for keyword in mrp_keywords)

    net_qty_keywords = ["net quantity", "net qty", "net weight", "net wt", "net content", "net volume"]
    net_qty_found = any(keyword in text_lower for keyword in net_qty_keywords)

    manufacturer_keywords = ["manufacturer", "manufactured by", "mfg by", "mfg.", "packed by", "marketed by"]
    manufacturer_found = any(keyword in text_lower for keyword in manufacturer_keywords)

    origin_keywords = ["country of origin", "made in", "origin :", "origin:"]
    origin_found = any(keyword in text_lower for keyword in origin_keywords)

    customer_care_keywords = ["customer care", "consumer care", "care cell", "helpline", "toll free", "toll-free", "email:"]
    customer_care_found = any(keyword in text_lower for keyword in customer_care_keywords)

    rules = {
        "mrp_found": mrp_found,
        "net_quantity_found": net_qty_found,
        "manufacturer_found": manufacturer_found,
        "country_of_origin_found": origin_found,
        "customer_care_found": customer_care_found
    }

    is_compliant = all(rules.values())

    return {
        "is_compliant": is_compliant,
        "overall_status": "Pass" if is_compliant else "Fail",
        "rules": rules
    }
