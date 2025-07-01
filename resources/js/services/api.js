
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getSalesData = async () => {
  try {
    const response = await api.get('/sales-data');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSalesRecord = async (data) => {
    console.log("This is a general log message.");
  try {
    const response = await api.post('/sales-data', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSalesRecord = async (id, data) => {
  try {
    const response = await api.put(`/sales-data/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSalesRecord = async (id) => {
  try {
    await api.delete(`/sales-data/${id}`);
  } catch (error) {
    throw error;
  }
};

export default api;