require('dotenv').config({ path: `${__dirname}/config/env` });
const PORT = Number(process.env.PORT || process.env.DEFAULT_PORT);

const express = require('express');
const cors = require('cors');

const { sequelize } = require('./models');

const usersRoutes = require('./routes/users');
const petsRoutes = require('./routes/pets');
const customersRoutes = require('./routes/customers');
const schedulesRoutes = require('./routes/schedules');

// JWT auth strategy
require('./config/passport/passport');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/pets', petsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/schedules', schedulesRoutes);

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
    try {
        switch (Number(process.env.SYNC)) {
            case 1:
                console.log("DoggoVac: Will force sync database");
                await sequelize.sync({ force: true });
                console.log("DoggoVac: Database synced");
                break;
            default:
                await sequelize.authenticate();
                console.log("DoggoVac: Database connected");
        }
    } catch (err) {
        console.error(err);
    };
});
