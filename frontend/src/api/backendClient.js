// True Tag - Created by Coding W/ night owls

import axios from "axios";

export async function analyzePackaging(formData) {
  const response = await axios.post("/api/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function fetchCertificate(scanId) {
  const response = await axios.get(`/api/products/${scanId}/certificate`);
  return response.data;
}

export async function fetchPriceHistory(scanId) {
  const response = await axios.get(`/api/products/${scanId}/price-history`);
  return response.data;
}

export async function fetchAuditHistory(limit = 20) {
  const response = await axios.get(`/api/products/audits?limit=${limit}`);
  return response.data;
}
