import About from "../components/About";
import ChangePassword from "../components/ChangePassword";
import CreateCustomer from "../components/CreateCustomer";
import CreatePet from "../components/CreatePet";
import Customers from "../components/Customers";
import Home from '../components/Home';
import Login from "../components/Login";
import Pets from "../components/Pets";
import Profile from "../components/Account";
import Register from "../components/Register";
import Schedules from "../components/Schedules";

const components = {
    about: {
        url: "/about",
        component: About
    },
    changePassword: {
        url: "/change-password",
        component: ChangePassword
    },
    createCustomer: {
        url: "/create-customer",
        component: CreateCustomer
    },
    createPet: {
        url: "/create-pet",
        component: CreatePet
    },
    customers: {
        url: "/customers",
        component: Customers
    },
    home: {
        url: "/",
        component: Home
    },
    login: {
        url: "/login",
        component: Login
    },
    pets: {
        url: "/pets",
        component: Pets
    },
    account: {
        url: "/account",
        component: Profile
    },
    register: {
        url: "/register",
        component: Register
    },
    schedules: {
        url: "/schedules",
        component: Schedules
    }
};

const privateRoutes = {
    guest: {
        allowedRoutes: [
            components.login,
            components.register,
            components.about,
            components.home
        ],
        redirectRoute: "/login"
    },
    user: {
        allowedRoutes: [
            components.about,
            components.home,
            components.changePassword,
            components.createCustomer,
            components.createPet,
            components.customers,
            components.pets,
            components.account,
            components.schedules
        ],
        redirectRoute: "/"
    }
};

export default privateRoutes;