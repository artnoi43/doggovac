const luxon = require('luxon');
const db = require('../models');
const { parseDate, createAnimalSchedules } = require('./schedules');

const includes = [db.Customer, db.Schedule];

const createPet = async (req, res) => {
    try {
        // Parse request
        const { name, dob, species, note, custId } = req.body;
        const userId = req.user.id

        // Create Pet -- if species is null, default to "dog"
        const createdPet = await db.Pet.create({
            name,
            dob,
            note,
            custId,
            uid: userId,
            species: species || "Dog",
        });

        // Create Schedules
        const birthday = parseDate(dob);
        await createAnimalSchedules(userId, createdPet.id, createdPet.species, birthday);

        // findOne() to confirm that it's actually created
        const pet = await db.Pet.findOne({
            where: { id: createdPet.id, uid: userId },
            include: includes
        });
        res.status(201).json(pet).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};

const getPets = async (req, res) => {
    try {
        const userId = req.user.id
        const pets = await db.Pet.findAll({
            where: { uid: userId },
            include: includes
        });
        res.status(200).json(pets).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};

const getPet = async (req, res) => {
    try {
        const targetId = Number(req.params.id);
        const userId = req.user.id
        const pet = await db.Pet.findOne({
            where: { id: targetId, uid: userId },
            include: includes
        });
        res.status(200).json(pet).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};

const updatePet = async (req, res) => {
    try {
        const targetId = Number(req.params.id);
        const userId = req.user.id
        const { name, dob, note } = req.body;
        const targetPet = await db.Pet.findOne({
            where: {id: targetId, uid: userId}
        })

        // Only clear schedules if DOB changes
        let willClearSchedules;
        if (dob === targetPet.dob) {
            willClearSchedules = false;
        } else {
            willClearSchedules = true;
        }

        const pet = await db.Pet.update({
            name: name,
            dob: dob,
            note: note
        }, {
            where: { id: targetId, uid: userId }
        });

        if (willClearSchedules) {
            // Destroy and update (create new) schedules
            await db.Schedule.destroy({
                where: { petId: targetId, uid: userId }
            });
            await createAnimalSchedules(req.user.id, targetId, pet.species, parseDate(dob));
        }

        res.status(200).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};

const deletePet = async (req, res) => {
    try {
        const targetId = Number(req.params.id);
        const userId = req.user.id
        await db.Pet.destroy({
            where: { id: targetId, uid: userId }
        });
        res.status(200).end();
    } catch (err) {
        res.status(500).json(err).end()
    };
};

module.exports = {
    createPet,
    getPets,
    getPet,
    updatePet,
    deletePet
};
