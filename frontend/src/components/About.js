import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="article">
            <h2>About</h2>
            <p>DoggoVac is a fullstack canine and feline vaccination management web application tool for small veterinary businesses, written completely in JavaScript. DoggoVac aims to be fast, small, and simple. This version of DoggoVac has user authentication.</p>
            <p>DoggoVac is powered by <a href="https://reactjs.org">React</a>, <a href="https://expressjs.com">Express</a>, and <a href="https://sequelize.org">Sequelize</a>. DoggoVac's backend uses <a href="https://moment.github.io/luxon/">Luxon</a> to format the date for dates of birth and schedules. These dates are Sequelize's <code>DataTypes.DATEONLY</code>.</p>
            <p>DoggoVac UI is designed mainly for desktop browsers, and I don't plan to make it look good on mobile. DoggoVac uses <a href="https://material-ui.com/"><code>@material-ui</code></a> React library for icons and other components</p>
            <p>The backend part of DoggoVac may later change to Go for better performance. The entire source code is available on <a href="https://github.com/artnoi43/doggovac">Github</a></p>
            <h2>Security</h2>
            <p>DoggoVac use secure HTTPS connections for backend-frontend communication, and user password is hashed using Bcrypt.</p>
            <h2><a href="https://artnoi.com/doggovac/">Deploying Your Own DoggoVac</a></h2>
            <p>You can clone the <a href="https://github.com/artnoi43/doggovac">Github repository</a> and run DoggoVac on your own computers.</p>
            <p>To run your own DoggoVac, you need to have a server running the <a href="https://github.com/artnoi43/doggovac/tree/main/backend">backend code</a> and a SQL DBMS. You should be fine with any DBMS, although DoggoVac is developed using MariaDB.</p>
            <h2>Basic Usage</h2>
            <h3>Creating Customer and Pets</h3>
            <p>To get the vaccination schedules, you will have to <Link to="/create-customer">create customers</Link> and <Link to="/create-pet">pets</Link>. The vaccination schedules for each pet are generated automatically on the server based on the pet's date of birth. These schedule dates can later be changed in the <Link to="/pets">Pets</Link> page.</p>
            <h3>Viewing and Editing Data</h3>
            <p>You can view and edit your data from the database with <Link to="/customer">Customers page</Link>, <Link to="/pets">Pets page</Link>, or <Link to="/schedules">Schedules page</Link></p>
            <p>These 3 pages have basic search functionality to filter the data table.</p>
            <h2>Notes</h2>
            <ol>
                <li>A pet can only be associated with one customer (owner) through the customer ID.</li>
                <li>All data in the database (users, customers, pets, and schedules) can be edited, but schedules cannot be deleted.</li>
            </ol>
        </div>
    );
};

export default About;
