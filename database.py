
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config import MONGO_URI, DATABASE_NAME, COLLECTION_NAME


client = None
db = None
audits_collection = None


def get_database():

    global client, db, audits_collection
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        client.admin.command("ping")
        db = client[DATABASE_NAME]
        audits_collection = db[COLLECTION_NAME]
        print(f"[Database] Connected successfully to MongoDB at {MONGO_URI}")
    except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as err:
        print(f"[Database Notice] MongoDB is offline ({err}). Using in-memory fallback.")
        audits_collection = None
    return audits_collection


in_memory_audits = []


def generate_price_history(declared_mrp: float, packaging_mrp: float = None) -> list:

    base_mrp = packaging_mrp if packaging_mrp else declared_mrp
    history = []
    today = datetime.utcnow()

    for i in range(5, -1, -1):
        dt = today - timedelta(days=i * 30)
        month_label = dt.strftime("%b %Y")

        market_diff = random.uniform(-0.15, -0.05)
        seller_diff = random.uniform(-0.08, 0.0) if i > 0 else (declared_mrp - base_mrp) / (base_mrp or 1)

        history.append({
            "date": month_label,
            "packaging_mrp": round(base_mrp, 2),
            "listing_price": round(base_mrp * (1 + seller_diff), 2),
            "market_average": round(base_mrp * (1 + market_diff), 2)
        })

    return history


def save_compliance_audit(audit_data: dict) -> dict:

    collection = get_database() if audits_collection is None else audits_collection


    audit_data["price_history"] = generate_price_history(
        declared_mrp=audit_data.get("declared_mrp", 0.0),
        packaging_mrp=audit_data.get("extracted_numeric_mrp")
    )

    if collection is not None:
        try:
            doc = audit_data.copy()
            res = collection.insert_one(doc)
            audit_data["_id"] = str(res.inserted_id)
        except Exception as e:
            print(f"[Database Error] Could not insert to MongoDB: {e}")
            in_memory_audits.insert(0, audit_data)
    else:
        in_memory_audits.insert(0, audit_data)

    return audit_data


def get_compliance_audit_by_id(audit_id: str) -> dict:

    collection = get_database() if audits_collection is None else audits_collection

    if collection is not None:
        try:
            doc = collection.find_one({"audit_id": audit_id}, {"_id": 0})
            if doc:
                return doc
        except Exception as e:
            print(f"[Database Error] Query failed: {e}")

    for doc in in_memory_audits:
        if doc.get("audit_id") == audit_id:
            return doc
    return None


def get_all_audits(limit: int = 20) -> list:

    collection = get_database() if audits_collection is None else audits_collection

    if collection is not None:
        try:
            cursor = collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit)
            return list(cursor)
        except Exception as e:
            print(f"[Database Error] Query failed: {e}")
            return in_memory_audits[:limit]
    else:
        return in_memory_audits[:limit]