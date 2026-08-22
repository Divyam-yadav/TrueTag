import re


def extract_price_value(text: str) -> tuple:
    mrp_regex_1 = r'(?:mrp|m\.r\.p|max(?:imum)?\s+retail\s+price)[^0-9\n\r]{0,20}(?:rs\.?|ps\.?|inr|₹)?\s*([0-9]+(?:[,\.][0-9]{1,2})?)\s*(?:\/[-=]|per|\n|\r|$)'
    match = re.search(mrp_regex_1, text, re.IGNORECASE)
    if match:
        raw_val = match.group(1).replace(',', '.')
        try:
            val = float(raw_val)
            return True, val, f"₹{val:.2f}"
        except ValueError:
            pass

    mrp_regex_multiline = r'(?:mrp|m\.r\.p|maximum\s+retail\s+price)[\s\S]{0,30}?(?:rs\.?|inr|₹)\s*([0-9]+(?:[,\.][0-9]{1,2})?)'
    match = re.search(mrp_regex_multiline, text, re.IGNORECASE)
    if match:
        raw_val = match.group(1).replace(',', '.')
        try:
            val = float(raw_val)
            return True, val, f"₹{val:.2f}"
        except ValueError:
            pass

    mrp_regex_tax = r'(?:rs\.?|inr|₹)\s*([0-9]+(?:[,\.][0-9]{1,2})?)[\s\S]{0,30}?(?:incl|taxes|all\s+taxes)'
    match = re.search(mrp_regex_tax, text, re.IGNORECASE)
    if match:
        raw_val = match.group(1).replace(',', '.')
        try:
            val = float(raw_val)
            return True, val, f"₹{val:.2f}"
        except ValueError:
            pass

    keywords = ["mrp", "m.r.p", "maximum retail price", "max retail price", "incl of all taxes", "incl. of all taxes", "inclusive of all taxes"]
    found = any(k in text.lower() for k in keywords)
    return found, None, "MRP declaration detected" if found else None


def extract_net_quantity(text: str) -> tuple:
    qty_regex = r'(?:net\s*quantit[y|i]|net\s*qt[y|i]|net\s*weight|net\s*wt|net\s*content|net\s*volume)[^0-9\n\r]{0,10}([0-9]+(?:\.[0-9]+)?\s*(?:g|kg|ml|l|ltr|gm|gms|units?|pcs|pieces|oz|[0-9]))'
    match = re.search(qty_regex, text, re.IGNORECASE)
    if match:
        return True, match.group(1).strip(), match.group(0).strip()

    keywords = ["net quantity", "netquantity", "net qty", "netqty", "net weight", "net wt", "net content", "net volume"]
    found = any(k in text.lower() for k in keywords)
    return found, "Net Quantity detected" if found else None, "Net Quantity detected" if found else None


def extract_manufacturer_info(text: str) -> tuple:
    mfg_regex = r'((?:manufactur[e|a]d|mfg\.?|packed|marketed|imported)[^\n\r]{5,120})'
    match = re.search(mfg_regex, text, re.IGNORECASE)
    if match:
        return True, match.group(1).strip()

    keywords = ["manufactured", "mfg by", "packed by", "marketed by", "imported by", "manufacturer", "pvt. ltd", "pvt ltd", "regd office"]
    found = any(k in text.lower() for k in keywords)
    return found, "Manufacturer details detected" if found else None


def extract_country_of_origin(text: str) -> tuple:
    origin_regex = r'((?:country\s+of\s+origin|made\s+in|origin\s*:)[:\s]+[^\n\r]{3,40})'
    match = re.search(origin_regex, text, re.IGNORECASE)
    if match:
        return True, match.group(1).strip()

    keywords = ["country of origin", "made in india", "made in", "origin:", "india"]
    found = any(k in text.lower() for k in keywords)
    return found, "Origin declaration detected" if found else None


def extract_customer_care_info(text: str) -> tuple:
    care_regex = r'((?:customer|consumer)\s+care[^\n\r]{5,120})'
    match = re.search(care_regex, text, re.IGNORECASE)
    if match:
        return True, match.group(1).strip()

    phone_match = re.search(r'(?:toll[\s\-]?free|helpline|ph(?:one)?\.?|tel)[:\s]+([0-9\-\s]{6,15})', text, re.IGNORECASE)
    email_match = re.search(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', text)
    if phone_match or email_match:
        contact_str = ""
        if phone_match:
            contact_str += f"Tel: {phone_match.group(0).strip()} "
        if email_match:
            contact_str += f"Email: {email_match.group(0).strip()}"
        return True, contact_str.strip()

    keywords = ["customer care", "consumer care", "care cell", "helpline", "toll free", "toll-free"]
    found = any(k in text.lower() for k in keywords)
    return found, "Consumer Care cell detected" if found else None


def aggregate_multi_image_compliance(image_scan_results: list) -> dict:
    rules_master = {
        "mrp": {
            "name": "Maximum Retail Price (MRP)",
            "statutory_ref": "Rule 6(1)(a) of Legal Metrology (Packaged Commodities) Rules, 2011",
            "passed": False,
            "extracted_value": None,
            "numeric_mrp": None,
            "source_image": None,
            "failure_reason": "Violation of Rule 6(1)(a): MRP (inclusive of all taxes) is missing from packaging panels."
        },
        "net_quantity": {
            "name": "Net Quantity / Weight",
            "statutory_ref": "Rule 6(1)(b) of Legal Metrology (Packaged Commodities) Rules, 2011",
            "passed": False,
            "extracted_value": None,
            "source_image": None,
            "failure_reason": "Violation of Rule 6(1)(b): Net quantity, weight, or volume statement is missing."
        },
        "manufacturer": {
            "name": "Manufacturer / Packer / Importer",
            "statutory_ref": "Rule 6(1)(d) of Legal Metrology (Packaged Commodities) Rules, 2011",
            "passed": False,
            "extracted_value": None,
            "source_image": None,
            "failure_reason": "Violation of Rule 6(1)(d): Complete identity and physical address of manufacturer or packer is missing."
        },
        "country_of_origin": {
            "name": "Country of Origin",
            "statutory_ref": "Rule 6(1)(n) of Legal Metrology (Packaged Commodities) Rules, 2011",
            "passed": False,
            "extracted_value": None,
            "source_image": None,
            "failure_reason": "Violation of Rule 6(1)(n): Country of origin declaration is mandatory for e-commerce."
        },
        "customer_care": {
            "name": "Consumer Care Redressal Details",
            "statutory_ref": "Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011",
            "passed": False,
            "extracted_value": None,
            "source_image": None,
            "failure_reason": "Violation of Rule 6(1)(e): Consumer grievance redressal contact (phone, email, or address) missing."
        }
    }

    for scan in image_scan_results:
        filename = scan.get("filename", "image")
        text = scan.get("extracted_text", "")

        if not rules_master["mrp"]["passed"]:
            found, num_mrp, val_str = extract_price_value(text)
            if found:
                rules_master["mrp"]["passed"] = True
                rules_master["mrp"]["extracted_value"] = val_str
                rules_master["mrp"]["numeric_mrp"] = num_mrp
                rules_master["mrp"]["source_image"] = filename

        if not rules_master["net_quantity"]["passed"]:
            found, val_str, full_str = extract_net_quantity(text)
            if found:
                rules_master["net_quantity"]["passed"] = True
                rules_master["net_quantity"]["extracted_value"] = val_str or full_str
                rules_master["net_quantity"]["source_image"] = filename

        if not rules_master["manufacturer"]["passed"]:
            found, val_str = extract_manufacturer_info(text)
            if found:
                rules_master["manufacturer"]["passed"] = True
                rules_master["manufacturer"]["extracted_value"] = val_str
                rules_master["manufacturer"]["source_image"] = filename

        if not rules_master["country_of_origin"]["passed"]:
            found, val_str = extract_country_of_origin(text)
            if found:
                rules_master["country_of_origin"]["passed"] = True
                rules_master["country_of_origin"]["extracted_value"] = val_str
                rules_master["country_of_origin"]["source_image"] = filename

        if not rules_master["customer_care"]["passed"]:
            found, val_str = extract_customer_care_info(text)
            if found:
                rules_master["customer_care"]["passed"] = True
                rules_master["customer_care"]["extracted_value"] = val_str
                rules_master["customer_care"]["source_image"] = filename

    passed_count = sum(1 for r in rules_master.values() if r["passed"])
    all_passed = (passed_count == 5)

    return {
        "rules": rules_master,
        "passed_rules_count": passed_count,
        "total_rules": 5,
        "all_rules_passed": all_passed
    }
