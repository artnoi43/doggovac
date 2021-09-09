const axios = require('axios');
axios.defaults.baseURL = "http://127.0.0.1:8000/api";
// axios.defaults.baseURL = "https://doggovac.artnoi.com/api";

const hiddenValue = "Hidden in this test";

const register = async (username, password) => {
    try {
        console.log(`Registering user ${username}`);
        const body = {
            username,
            password
        };
        await axios.post('/users/register', body);
        console.log("Registration successful");
    } catch (err) {
        console.error(err);
    };
};

const login = async (username, password) => {
    try {
        console.log(`Loggin in user ${username}`);
        const body = {
            username,
            password
        };
        const res = await axios.post('/users/login', body);
        const { token } = res.data;
        console.log("Login successful");
        return token;
    } catch (err) {
        console.error(err);
    };
};

const getUsers = async () => {
    try {
        console.log("Test getting users");
        const res = await axios.get('/users');
        console.log("Got users: ", res.data);
    } catch (err) {
        console.error(err);
    };
};

const deleteUser = async (username) => {
    try {
        console.log(`Deleting user ${username}`);
        await axios.delete('/users');
        console.log(`Deleted user ${username}`);
    } catch (err) {
        console.error(err);
    };
};

const createCustomer = async () => {
    try {
        console.log("Creating customer");
        const body = {
            name: "Prem Phan",
            contact: "11210",
            address: "9/3"
        };
        const res = await axios.post('/customers', body);
        console.log("Created customer:", res.data);
        // Return custId
        return res.data.id;
    } catch (err) {
        console.error(err);
    };
};

const getCustomer = async (custId) => {
    try {
        console.log("Getting customers");
        const res = await axios.get(`/customers/${custId}`);
        console.log("Got customer:", res.data);
    } catch (err) {
        console.error(err);
    };
};

const updateCustomer = async (custId) => {
    try {
        console.log(`Updating customer ${custId}`);
        const body = {
            name: "New Cust Name",
            contact: "1150",
            address: "3/9"
        };
        await axios.put(`/customers/${custId}`, body);
        console.log(`Updated customer ${custId}`);
        await getCustomer(custId);
    } catch (err) {
        console.error(err);
    };
};

const createPet = async (custId) => {
    try {
        console.log("Creating pet");
        const body = {
            name: "Beagie",
            dob: "2019-05-07",
            custId
        };
        const res = await axios.post('/pets', body);
        console.log("Created pet:", { ...res.data, Schedules: hiddenValue });
        // Return petId
        return res.data.id;
    } catch (err) {
        console.error(err);
    };
};

const getPet = async (petId) => {
    try {
        console.log(`Getting pet ${petId}`);
        const res = await axios.get(`/pets/${petId}`);
        console.log("Got pet:", { ...res.data, Customer: hiddenValue, Schedules: hiddenValue });
    } catch (err) {
        console.error(err);
    };
};

const updatePet = async (petId) => {
    try {
        console.log(`Updating pet ${petId}`);
        const body = {
            name: "New Pet Name",
            dob: "2021-03-12",
            note: "New Pet Note"
        };
        await axios.put(`/pets/${petId}`, body);
        console.log(`Updated pet ${petId}`);
        getPet(petId);
    } catch (err) {
        console.error(err);
    };
};

const getSchedules = async () => {
    try {
        console.log("Getting schedules");
        const res = await axios.get('/schedules');
        lastSchedule = res.data[res.data.length - 1];
        console.log("Got schedules, showing last schedule only", { ...lastSchedule, Pet: hiddenValue });
        // Return scheduleId of last schedule
        return lastSchedule.id;
    } catch (err) {
        console.error(err);
    };
};

const updateSchedule = async (scheduleId) => {
    try {
        console.log(`Updating schedule ${scheduleId}`);
        const body = {
            date: "2036-12-12",
            status: true
        }
        await axios.put(`/schedules/${scheduleId}`, body);
        console.log(`Updated schedule ${scheduleId}`);
        await getSchedules();
    } catch (err) {
        console.error(err);
    };
};

const getDue = async () => {
    try {
        console.log("Getting schedules (due)");
        const dues = ["today", "week", "month", "year"];
        dues.forEach(async (due) => {
            const res = await axios.get(`/schedules/${due}`);
            const dueSchedules = res.data;
            // Hide embedded pet data
            dueSchedules.forEach(dueSchedule => {
                dueSchedule.Pet = hiddenValue;
            });
            console.log(`Due: ${due}`, dueSchedules);
        });
    } catch (err) {
        console.error(err);
    };
};

const genName = (len) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (let i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    };
    return result;
};

const axiosConfig = (token) => {
    // Inject HTTP header for authorization with JWT
    axios.interceptors.request.use(
        config => {
            // For paths /users/register and /users/login
            if (config.url.includes("/login") || config.url.includes('/register')) {
                return config;
                // For other paths that requires JWT auth
            } else {
                if (token) {
                    config.headers["Authorization"] = `Bearer ${token}`
                };
                return config;
            };
        },
        error => {
            Promise.reject(error);
        }
    );
};

async function main() {
    const username = genName(6);
    const password = "mySuperSecret";
    // /users
    await register(username, password);
    const token = await login(username, password);
    axiosConfig(token);
    await getUsers();
    // /customers
    const custId = await createCustomer();
    await getCustomer(custId);
    await updateCustomer(custId);
    // /pets
    const petId = await createPet(custId);
    await getPet(petId);
    await updatePet(petId);
    // /schedules
    const scheduleId = await getSchedules();
    await updateSchedule(scheduleId);
    await getDue();
    await deleteUser(username);
};

main();