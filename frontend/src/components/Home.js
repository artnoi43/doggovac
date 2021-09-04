import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../App';

function Home() {
    const { username, role } = useContext(authContext)

    return (
        <>
            {role === "user" ? <h1 className="green">Welcome to DoggoVac, {username}!</h1> : <h1>Welcome to DoggoVac</h1>}
            <p>DoggoVac is a KISS fullstack JavaScript application for desktop web browsers.</p>
            <p>It is used to track and manage multiple pet's vaccination dates for small veterinary businesses.</p>
            <p>You can also host your own DoggoVac by <a href="https://artnoi.com/doggovac/">following this guide</a></p>
            <p>The source code is available on <a href="https://github.com/artnoi43/doggovac">Github</a>.</p>
            <div className="article">
                <h3>Quick Start</h3>
                <ol>
                    {role === "guest" ? <>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </> : null
                    }
                    <li><Link to="/create-customer">Create Customer</Link></li>
                    <li><Link to="/create-pet">Create Pet</Link></li>
                    <li><Link to="/schedules">View Schedule</Link></li>
                </ol>
            </div>
        </>
    );
};

export default Home;
