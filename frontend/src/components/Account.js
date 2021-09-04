import { useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { Button, ButtonGroup } from '@material-ui/core'
import { authContext } from '../App';
import { LogOutButton } from './Header';
import Customers from './Customers';

function Profile() {

    const { username } = useContext(authContext);

    const deleteUser = async () => {
        try {
            await axios.delete(`/users`);
            console.log(`Delete user ${username} successfully`)
            window.location.reload();
        } catch (err) {
            console.error(`Failed to delete user ${username}`);
            console.error(err);
        };
    }

    return (
        <div>
            <h1>Profile</h1>
            <h2>{username}</h2>
            <ButtonGroup color="inherit">
                <Button><Link to="/change-password">Change Password</Link></Button>
                <LogOutButton />
            </ButtonGroup>
            <br />
            <Button variant="outlined" color="secondary" onClick={deleteUser}>Delete User!</Button>
            <Customers />
        </div>
    );
};

export default Profile;
