import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, TextField } from '@material-ui/core';
import axios from '../config/axios';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [done, setDone] = useState(false)

    const onUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const onConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };
    const onFinish = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            const body = { username, password };
            try {
                const path = "/users/register";
                await axios.post(path, body);
                setDone(true);
            } catch (err) {
                alert(`Registration for ${username} failed`)
                console.error(err);
            };
        } else {
            alert("Passwords not matched")
        };
    };

    return (
        <>
            <h1>Register User</h1>
            <p>If you are a small veterinary business, you may want to create only one superuser (i.e. an admin account).</p>
            {done ? <>
                <p className="green">User {username} successfully registered. You can now <Link to="/login">login</Link> to the created user</p>
            </> : <>
                <form onSubmit={onFinish}>
                    <h2>Username</h2>
                    <Input placeholder="Username" onChange={onUsernameChange} />
                    <h2>Password</h2>
                    <TextField type="password" placeholder="Password" onChange={onPasswordChange} />
                    <h2>Confirm Password</h2>
                    <TextField type="password" placeholder="Confirm Password" onChange={onConfirmPasswordChange} />
                    <h2>Register</h2>
                    <input type="submit" />
                </form>
            </>}
        </>
    );
};

export default Register;
