import axios from "axios";

export async function analyzeProduct(formData) {
  const response = await axios.post("/api/products/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function fetchAuditLog(scanId) {
  const response = await axios.get(`/api/products/${scanId}/price-history`);
  return response.data;
}

export async function fetchCertificate(scanId) {
  const response = await axios.get(`/api/products/${scanId}/certificate`);
  return response.data;
}

export async function fetchAllAudits(limit = 20) {
  const response = await axios.get(`/api/products/audits?limit=${limit}`);
  return response.data;
}
