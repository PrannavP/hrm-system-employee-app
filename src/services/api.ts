import axios from "axios";

const API_URL = "http://192.168.2.110:5000/api";

export const checkIn = async (latitude: number, longitude: number, emp_id: string) => {
    return axios.post(`${API_URL}/checkin`, { latitude, longitude, emp_id });
};

export const checkOut = async (latitude: number, longitude: number, emp_id: string) => {
    return axios.post(`${API_URL}/checkout`, { latitude, longitude, emp_id });
};

export const login = async (email: string, password: string) => {
    return axios.post(`${API_URL}/login-employee`, { email, password });
};