import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/",
    headers: {
        "Access-Control-Allow-Origin": true
    }
});

export default apiClient;