const db = require('../models');
const luxon = require('luxon');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const includes = [
    { model: db.Pet, include: [db.Customer] }
];

// Parse ISO date string to Luxon.DateTime
const parseDate = (dob) => {
    return luxon.DateTime.fromISO(dob);
};

// Create schedule entries in database
const createSchedules = async (userId, petId, schedules) => {
    try {
        // Create Vaccination db.Schedule
        for (let key in schedules) {
            await db.Schedule.create({
                vaccine: key,
                // date is DataTypes.DATEONLY
                date: schedules[key].toSQLDate(),
                status: false,
                petId: petId,
                uid: userId
            });
        };
    } catch (err) {
        console.error(err);
    };
};

// Create vaccination schedules for dogs
const createDogSchedules = async (userId, petId, birthday) => {
    const schedules = {
        "Canine Core 1": birthday.plus({ weeks: 6 }),
        "Canine Core 2": birthday.plus({ weeks: 9 }),
        "Canine Core 3": birthday.plus({ weeks: 12 }),
        "Canine Core 4": birthday.plus({ weeks: 16 }),
        "Canine Lyme 1": birthday.plus({ weeks: 14 }),
        "Canine Lyme 2": birthday.plus({ weeks: 17 }),
        "Canine Rabies 1": birthday.plus({ weeks: 16 }),
        "Canine Bordetella 1": birthday.plus({ weeks: 14 }),
    };

    // Generate booster shot dates every year
    const generateBoost = (obj) => {
        // Assume dog will live for 15 years
        for (let i = 1; i <= 15; i++) {
            obj[`Booster Canine Core ${i}`] = obj["Canine Core 4"].plus({ years: i });
            obj[`Booster Canine Lyme ${i}`] = obj["Canine Lyme 2"].plus({ years: i });
            obj[`Booster Canine Rabies ${i}`] = obj["Canine Rabies 1"].plus({ years: i });
            obj[`Booster Canine Bordetella ${i}`] = obj["Canine Bordetella 1"].plus({ years: i });
        };
    };

    // Generate schedules for booster shots
    generateBoost(schedules);
    await createSchedules(userId, petId, schedules);
};

// Create vaccination schedules for cats
const createCatSchedules = async (userId, petId, birthday) => {
    const schedules = {
        "Feline Core 1": birthday.plus({ weeks: 6 }),
        "Feline Core 2": birthday.plus({ weeks: 10 }),
        "Feline Core 3": birthday.plus({ weeks: 14 }),
        "Feline FeLV 1": birthday.plus({ weeks: 6 }),
        "Feline FeLV 2": birthday.plus({ weeks: 10 }),
        "Feline FeLV 3": birthday.plus({ weeks: 14 }),
        "Feline Rabies 1": birthday.plus({ weeks: 14 }),
        "Feline Bordetella 1": birthday.plus({ weeks: 8 }),
    };

    // Generate booster shot dates every year
    const generateBoost = (obj) => {
        // Assume cat will live for 15 years
        for (let i = 1; i <= 15; i++) {
            obj[`Booster Feline Core ${i}`] = obj["Feline Core 3"].plus({ years: i });
            obj[`Booster Feline FeLV ${i}`] = obj["Feline FeLV 3"].plus({ years: i });
            obj[`Booster Feline Rabies ${i}`] = obj["Feline Rabies 1"].plus({ years: i });
            obj[`Booster Feline Bordetella ${i}`] = obj["Feline Bordetella 1"].plus({ years: i });
        };
    };

    // Generate schedules for booster shots
    generateBoost(schedules);
    await createSchedules(userId, petId, schedules);
};

// Species switch
const createAnimalSchedules = async (userId, petId, species, birthday) => {
    switch (species) {
        case "Cat":
            await createCatSchedules(userId, petId, birthday);
            break;
        // Default to dogs
        default:
            await createDogSchedules(userId, petId, birthday);
    }
}

const getSchedules = async (req, res) => {
    try {
        const userId = req.user.id
        const schedules = await db.Schedule.findAll({
            where: { uid: userId },
            include: includes
        });

        res.status(200).json(schedules).end();
    } catch (err) {
        res.status(500).json(err).end()
    };
};

const updateSchedule = async (req, res) => {
    try {
        const targetId = req.params.id;
        const userId = req.user.id;
        const { date, status } = req.body;
        await db.Schedule.update({
            date: date,
            status: status
        }, {
            where: { id: targetId, uid: userId }
        });

        res.status(200).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};


const getDue = async (req, res) => {
    try {
        const due = req.params.due;
        const userId = req.user.id
        const today = luxon.DateTime.now();
        let start, end;

        switch (due) {
            case "today":
                start = today.startOf('day');
                end = today.endOf('day');
                break;
            case "week":
                start = today.startOf('week');
                end = today.endOf('week');
                break;
            case "month":
                start = today.startOf('month');
                end = today.endOf('month');
                break;
            case "year":
                start = today.startOf('year');
                end = today.endOf('year');
                break;
        };

        const schedules = await db.Schedule.findAll({
            where: {
                uid: userId,
                date: {
                    [Op.between]: [start.toSQLDate(), end.toSQLDate()]
                }
            }, include: includes
        });

        res.status(200).json(schedules).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};

module.exports = {
    parseDate,
    createAnimalSchedules,
    getSchedules,
    updateSchedule,
    getDue
};
