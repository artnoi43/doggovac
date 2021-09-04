import axios from 'axios';
import LocalStorageServices from '../services/localStorage';

axios.defaults.baseURL = "https://doggovac.artnoi.com/api";

// Inject HTTP header for authorization with JWT
axios.interceptors.request.use(
    config => {
        // For paths /users/register and /users/login
        if (config.url.includes("/login") || config.url.includes('/register')) {
            return config;
            // For other paths that requires JWT auth
        } else {
            const token = LocalStorageServices.getToken();
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`
            }
            return config;
        }
    },
    error => {
        Promise.reject(error);
    }
);

// If token expired, logout
axios.interceptors.response.use(
    response => {
        return response
    },
    err => {
        // if (error.response && error.response.status) {
        if (err.response?.status === 401) {
            LocalStorageServices.removeToken();
            alert("Authorization token has expired, please login again");
            window.location.reload();
            return Promise.reject(err);
        };
        return Promise.reject(err);
    }
)

export default axios;