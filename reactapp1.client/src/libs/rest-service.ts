import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7170', 
    timeout: 120000, 
    headers: { 'Content-Type': 'application/json' }
});


export const get = async (url: string) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const post = async (url:string, data: any) => {
    try {
        console.log('Sending POST request to:', url);
        console.log('Request data:', data);
        const response = await api.post(url, data);
        console.log('Response received:', response.data);
        return response.data;
    } catch (error: any) {
        console.error("POST Error Details:");
        console.error("URL:", url);
        console.error("Request Data:", data);
        console.error("Error:", error);
        console.error("Error Message:", error.message);
        console.error("Error Response:", error.response);
        console.error("Error Response Data:", error.response?.data);
        console.error("Error Response Status:", error.response?.status);
        console.error("Error Response Headers:", error.response?.headers);
        throw error;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const put = async (url: string, data: any) => {
    try {
        console.log('Sending PUT request to:', url);
        console.log('Request data:', data);
        const response = await api.put(url, data);
        console.log('Response received:', response.data);
        return response.data;
    } catch (error: any) {
        console.error("PUT Error Details:");
        console.error("URL:", url);
        console.error("Request Data:", data);
        console.error("Error:", error);
        console.error("Error Message:", error.message);
        console.error("Error Response:", error.response);
        console.error("Error Response Data:", error.response?.data);
        console.error("Error Response Status:", error.response?.status);
        console.error("Error Response Headers:", error.response?.headers);
        throw error;
    }
};

