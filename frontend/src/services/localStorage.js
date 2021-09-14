const setToken = (token) => {
    localStorage.setItem("ACCESS_TOKEN", token);
};

const getToken = () => {
    return localStorage.getItem("ACCESS_TOKEN");
};

const removeToken = () => {
    localStorage.removeItem("ACCESS_TOKEN");
};

const getRole = () => {
    if (getToken()) {
        return "user"
    } else {
        return "guest"
    };
};

const LocalStorageServices = {
    setToken,
    getToken,
    removeToken,
    getRole
}

export default LocalStorageServices;