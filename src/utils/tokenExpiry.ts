import apiClient from "../services/apiClient";

// API for checking token expiry
const checkTokenExpiry = async () => {
    apiClient.get("/api/blacklist", { headers: { "auth-token": localStorage.getItem('auth-token') } })
        .then(() => {
            return true
        })
        .catch(() => {
            return false;
        });
}

export default checkTokenExpiry;