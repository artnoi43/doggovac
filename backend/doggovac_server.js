require('dotenv').config({ path: 'config/ENV' });

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

app.listen(Number(process.env.PORT), async () => {
    console.log(`Server listening on port ${process.env.PORT}`);
    try {
        switch (process.env.DB) {
            case "SYNC":
                await sequelize.sync({ force: true });
                console.log(`Database synced`);
                break;
            default:
                await sequelize.authenticate();
                console.log(`Database connected`);
        }
    } catch (err) {
        console.error(err);
    };
});
