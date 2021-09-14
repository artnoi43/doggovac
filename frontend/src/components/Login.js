import { useState, useContext } from 'react';
import { Input, TextField } from '@material-ui/core';
import { authContext } from '../App';
import axios from 'axios';
import LocalStorageServices from '../services/localStorage';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { setRole, setLoggedIn } = useContext(authContext);

    const onUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const onFinish = async (e) => {
        e.preventDefault();
        if (password) {
            const body = { username, password };
            try {
                const path = "/users/login";
                await axios.post(path, body)
                    .then(res => {
                        LocalStorageServices.setToken(res.data.token);
                        setRole("user");
                        setLoggedIn(true);
                    })
                    .catch(err => {
                        alert("Login failed");
                        console.error(err);
                    });

            } catch (err) {
                console.error(err);
            };
        } else {
            alert("Please enter your password")
        };
    };

    return (
        <>
            <h1>Login</h1>
            <p>Welcome to DoggoVac</p>
            <form onSubmit={onFinish}>
                <h2>Username</h2>
                <Input placeholder="Username" onChange={onUsernameChange} />
                <h2>Password</h2>
                <TextField type="password" placeholder="Password" onChange={onPasswordChange} />
                <h2>Login</h2>
                <input type="submit" />
            </form>
        </>
    );
};

export default Login;