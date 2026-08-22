import re


def extract_price_value(text: str) -> tuple:

    mrp_regex = r'(?:mrp|m\.r\.p|max(?:imum)?\s+retail\s+price)[^0-9\n\r]{0,15}(?:rs\.?|ps\.?|inr|₹)?\s*([0-9]{1,6}(?:[,\.][0-9]{2})?)'
    match = re.search(mrp_regex, text, re.IGNORECASE)
    if match:
        raw_val = match.group(1).replace(',', '.')
        try:
            val = float(raw_val)
            return True, val, match.group(0).strip()
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


def perform_cross_verification(declared_mrp: float, declared_net_qty: str, aggregated_rules: dict) -> dict:
    mrp_rule = aggregated_rules["rules"]["mrp"]
    qty_rule = aggregated_rules["rules"]["net_quantity"]

    discrepancies = []
    has_critical_violation = False

    mrp_status = "Not Extracted"
    physical_mrp = mrp_rule.get("numeric_mrp")

    if physical_mrp is not None and declared_mrp is not None:
        if declared_mrp > physical_mrp:
            mrp_status = "Overpriced"
            has_critical_violation = True
            discrepancies.append({
                "field": "Maximum Retail Price (MRP)",
                "declared": f"₹{declared_mrp:.2f}",
                "packaging": f"₹{physical_mrp:.2f}",
                "severity": "Critical",
                "message": f"Illegal Overpricing: Seller listing price (₹{declared_mrp:.2f}) exceeds physical packaging MRP (₹{physical_mrp:.2f}). Violation of Section 18 / Rule 18(2)."
            })
        elif declared_mrp < physical_mrp:
            mrp_status = "Discounted"
            discrepancies.append({
                "field": "Maximum Retail Price (MRP)",
                "declared": f"₹{declared_mrp:.2f}",
                "packaging": f"₹{physical_mrp:.2f}",
                "severity": "Match",
                "message": f"Compliant: Listing price (₹{declared_mrp:.2f}) is discounted below packaging MRP (₹{physical_mrp:.2f})."
            })
        else:
            mrp_status = "Exact Match"
            discrepancies.append({
                "field": "Maximum Retail Price (MRP)",
                "declared": f"₹{declared_mrp:.2f}",
                "packaging": f"₹{physical_mrp:.2f}",
                "severity": "Match",
                "message": f"Exact Match: Listing price (₹{declared_mrp:.2f}) matches packaging MRP."
            })
    else:
        discrepancies.append({
            "field": "Maximum Retail Price (MRP)",
            "declared": f"₹{declared_mrp:.2f}" if declared_mrp else "Not Declared",
            "packaging": mrp_rule.get("extracted_value") or "Missing on Label",
            "severity": "Warning" if not physical_mrp else "Match",
            "message": "Numeric price could not be automatically parsed from packaging label."
        })

    qty_status = "Match"
    packaging_qty = qty_rule.get("extracted_value")
    if declared_net_qty and packaging_qty:
        norm_declared = re.sub(r'\s+', '', declared_net_qty.lower())
        norm_packaging = re.sub(r'\s+', '', packaging_qty.lower())
        if norm_declared in norm_packaging or norm_packaging in norm_declared:
            qty_status = "Match"
            discrepancies.append({
                "field": "Net Quantity",
                "declared": declared_net_qty,
                "packaging": packaging_qty,
                "severity": "Match",
                "message": f"Consistent: Declared quantity matches packaging label."
            })
        else:
            qty_status = "Mismatch"
            discrepancies.append({
                "field": "Net Quantity",
                "declared": declared_net_qty,
                "packaging": packaging_qty,
                "severity": "Warning",
                "message": f"Quantity Discrepancy: Declared '{declared_net_qty}' differs from physical label '{packaging_qty}'."
            })

    is_compliant = aggregated_rules["all_rules_passed"] and not has_critical_violation
    compliance_status = "COMPLIANT" if is_compliant else "REJECTED_NON_COMPLIANT"

    return {
        "compliance_status": compliance_status,
        "is_compliant": is_compliant,
        "has_critical_violation": has_critical_violation,
        "discrepancies": discrepancies,
        "mrp_cross_status": mrp_status,
        "qty_cross_status": qty_status
    }