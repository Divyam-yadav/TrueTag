# TrueTag 🏷️ 
**Automated Legal Metrology Compliance Checker**

> Built in 24 hours for **SquidHack 2026** 🦑

E-commerce platforms face heavy regulatory penalties when sellers fail to display mandatory product details. **TrueTag** automates this auditing process, shifting it from a manual, impossible task into a highly scalable AI pipeline. Our platform uses computer vision to ensure that product packaging complies with the Indian Legal Metrology (Packaged Commodities) Rules, 2011.

---

### 🚀 Key Features

*   **Multi-Image Computer Vision Pipeline:** Upload up to 5 product images (front, back, sides). The system aggregates data across all angles to verify compliance.
*   **Advanced Image Pre-Processing:** Utilizes OpenCV for grayscaling, auto-rotation, dark-background inversion, and adaptive thresholding to clean messy, real-world photos.
*   **Smart OCR Extraction:** Powered by Tesseract OCR and a robust fuzzy-matching regex engine to extract:
    *   Maximum Retail Price (MRP)
    *   Net Quantity
    *   Manufacturer / Packer Details
    *   Country of Origin
    *   Consumer Care Redressal Details
*   **Cross-Verification Engine:** Automatically compares seller-declared form data against the physical text printed on the packaging to flag discrepancies and prevent fraud.
*   **Digital Certification & Audit Trail:** Generates a downloadable "Verified Seller Compliance Certificate" for 100% compliant items, and saves detailed rejection audit logs for non-compliant items in a MongoDB database.
*   **Market Price Graph:** Real-time visual tracking of declared prices versus extracted MRPs.

---

### 🛠️ Tech Stack

**Frontend:**
*   React (JavaScript)
*   Vite
*   Tailwind CSS
*   Recharts (for Data Visualization)

**Backend:**
*   Python
*   FastAPI (Asynchronous API routing)
*   OpenCV (`cv2` for image processing)
*   Pytesseract (Optical Character Recognition)

**Database:**
*   MongoDB

---

### 💻 How to Run Locally

#### 1. Start the Python Backend
Ensure you have Python 3.x and Tesseract-OCR installed on your machine.
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend runs at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend dashboard runs at: `http://localhost:5173`

### 3. Database (MongoDB)
Ensure local MongoDB is running on port `27017` (`mongodb://localhost:27017`).
*(Note: If MongoDB is not active, the backend automatically uses an in-memory fallback so your hackathon presentation never crashes!)*
