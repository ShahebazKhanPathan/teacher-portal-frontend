import apiClient from "../services/apiClient";

// API for logging out
const logOut = async () => {
    await apiClient.delete("/api/blacklist",
        { headers: { "auth-token": localStorage.getItem('auth-token') } })
        .then(() => {
            localStorage.removeItem("auth-token");
            location.href = "/";
        })
        .catch((err) => console.log(err));
}

export default logOut;