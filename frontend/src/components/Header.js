import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import LocalStorageServices from '../services/localStorage';
import { authContext } from '../App';
import Logo from '../logo.png';

export function LogOutButton({ variant, color }) {
    const { username, setRole } = useContext(authContext);

    const logout = () => {
        LocalStorageServices.removeToken();
        setRole("guest");
    };
    return (
        <Button
            color={color}
            variant={variant}
            onClick={() => logout()}>
            Logout as {username}
        </Button>
    );
};

function Header() {

    const { role } = useContext(authContext);

    return (
        <nav>
            <div>
                <Link to="/"><img className="logo" src={Logo} alt="" />DoggoVac</Link>
                {role === "guest" ? <>
                    <Link to="/about">About</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </> : <>
                    <Link to="/about">About</Link>
                    <Link to="/schedules">Schedules</Link>
                    <Link to="/customers">Customers</Link>
                    <Link to="/pets">Pets</Link>
                    <Link to="/create-customer">Create Customer</Link>
                    <Link to="/create-pet">Create Pet</Link>
                    <Link to="/account">Account</Link>
                    <LogOutButton variant="outlined" color="secondary" />
                </>}
            </div>
        </nav>
    );
};

export default Header;