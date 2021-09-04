import { useState, useContext } from 'react';
import { TextField } from '@material-ui/core';
import axios from '../config/axios';
import { authContext } from '../App';

function ChangePassword() {

    const [updating, setUpdating] = useState(false);
    const [done, setDone] = useState(false)
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const { username } = useContext(authContext);

    const onNewPwChange = (e) => {
        setNewPassword(e.target.value);
    };

    const onConfrimNewPwChange = (e) => {
        setConfirmNewPassword(e.target.value);
    };

    const onFinish = async (e) => {
        e.preventDefault();
        if (newPassword === confirmNewPassword) {
            try {
                setUpdating(true);
                await axios.patch(`/users/changepassword`, {
                    newPassword: newPassword
                });
                setUpdating(false);
                setDone(true);
                console.log(`Password successfully updated`);
            } catch (err) {
                console.error(`Failed to update password`);
                console.error(err);
            };
        } else {
            alert('Passwords not matched')
        };
    };

    return (
        <>
            {done ? <p className="green">Password Successfully Updated for {username}</p> :
                <form onSubmit={onFinish}>
                    <h1>Change User Password for {username}</h1>
                    {updating ? <p className="green">Updating password..</p> : null}
                    <TextField type="password" placeholder="New Password" onChange={onNewPwChange} />
                    <br />
                    <TextField type="password" placeholder="Confirm New Password" onChange={onConfrimNewPwChange} />
                    <p>Update Password</p>
                    <input type="submit" />
                </form>
            }
        </>
    );
};

export default ChangePassword;
