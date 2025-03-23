import axios from "axios";

const API_URL = "http://192.168.1.11:5000/api";

// checkin api endpoint
export const checkIn = async (latitude: number, longitude: number, emp_id: string) => {
    return axios.post(`${API_URL}/checkin`, { latitude, longitude, emp_id });
};

// checkout api endpoint
export const checkOut = async (latitude: number, longitude: number, emp_id: string) => {
    return axios.post(`${API_URL}/checkout`, { latitude, longitude, emp_id });
};

// employee login endpoint
export const login = async (email: string, password: string) => {
    return axios.post(`${API_URL}/login-employee`, { email, password });
};

// employee request leave endpoint
export const leaveRequest = async(leave_type: string, starting_date: string, ending_date:string, emp_id:string, reason:string) => {
    const payload: { leave_type: string, starting_date: string, ending_date?: string, emp_id: string, reason: string } = {
        leave_type,
        starting_date,
        emp_id,
        reason
    };

    if(ending_date){
        payload.ending_date = ending_date;
    }

    console.log(payload);

    return axios.post(`${API_URL}/ask-leave`, payload)
};

// employee view their leave requests
export const fetchLeaveRequests = async(emp_table_id: string) => {
    return axios.post(`${API_URL}/get-leaves`, { emp_table_id })
};

// employee profile endpoint
export const fetchEmployeeProfile = async(emp_table_id: number) => {
    return axios.post(`${API_URL}/get-employee`, { emp_table_id });
};