// This file is a scratchpad in case I want to add vaccines database with inventory functionality

const luxon = require('luxon');

const birthday = "2019-05-07"
const bod = luxon.DateTime.fromISO(birthday);

// These are vaccine objects. These may be put in a database table 'vaccine'
const puppy = {
    name: "Puppy shots",
    stock: 200
};
const lyme = {
    name: "Lyme",
    stock: 100
};
const rabies = {
    name: "Rabies",
    stock: 200
};
const bordetella = {
    name: "Bordetella",
    stock: 100
};
const puppyBooster = {
    name: "Puppy booster shot",
    vaccine: puppy
};
const lymeBooster = {
    name: "Lyme booster shot",
    vaccine: lyme
};
const rabiesBooster = {
    name: "Rabies booster shot",
    vaccine: rabies
};
const bordetellaBooster = {
    name: "Bordetella booster shot",
    vaccine: bordetella
};

// vaccinesInfo and boosterShotsInfo contain schedule information
const vaccinesInfo = [
    {
        vaccine: puppy,
        round: 1,
        weeksAfterBod: 6
    },
    {
        vaccine: puppy,
        round: 2,
        weeksAfterBod: 9
    },
    {
        vaccine: puppy,
        round: 3,
        weeksAfterBod: 12
    },
    {
        vaccine: puppy,
        round: 4,
        weeksAfterBod: 16
    },
    {
        vaccine: lyme,
        round: 1,
        weeksAfterBod: 14
    },
    {
        vaccine: lyme,
        round: 2,
        weeksAfterBod: 17
    },
    {
        vaccine: rabies,
        round: 1,
        weeksAfterBod: 16
    },
    {
        vaccine: bordetella,
        round: 1,
        weeksAfterBod: 14
    }
];

// Schedules is now implemented as map that maps vaccination info to vaccination date
const schedules = new Map();

// Generate non-booster shots
vaccinesInfo.forEach((info) => {
    vaccine = info.vaccine;
    round = info.round
    // Add to map schedules
    schedules
        .set({ vaccine, round, isBooster: false }, bod.plus({ weeks: info.weeksAfterBod }).toSQLDate())
});

// Generate booster shots every year
// vaccinesInfo and boosterShotsInfo contain schedule information
const boosterShotsInfo = [];
const boosters = [puppyBooster, lymeBooster, rabiesBooster, bordetellaBooster];

// Assume dogs live for 15 years
for (let i = 1; i <= 15; i++) {
    boosters.forEach((booster) => {
        vaccine = booster.vaccine
        boosterShotsInfo.push({ vaccine, round: i, isBooster: true })
    });
};

boosterShotsInfo.forEach((info) => {
    for (let i = 1; i <= 15; i++) {
        // Add to map schedules
        schedules
            .set(info, bod.plus({ years: info.round }).toSQLDate());
    }
});

// body may be sent as a JSON response for schedules controller
const body = [];

schedules
    .forEach((v, k) => {
        let isBooster = k.isBooster;
        let round = k.round;
        let vaccine = k.vaccine;
        body.push({ isBooster, round, vaccine });
    });

console.log(body);