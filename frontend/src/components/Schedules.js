import { useState, useEffect, useCallback, createContext } from 'react';
import { Input, Button, ButtonGroup, Checkbox } from '@material-ui/core';
import axios from '../config/axios';
import Schedule from './Schedule';
import FetchFail from './status/FetchFail';
import NoneFound from './status/NoneFound';

export const schedulesContext = createContext(null);

function Schedules() {
    const [due, setDue] = useState("all");
    const [schedules, setSchedules] = useState([]);
    // Show edit and show more fields
    const [showEdit, setShowEdit] = useState(false);
    const [showPetId, setShowPetId] = useState(false);
    const [showSpecies, setShowSpecies] = useState(false);
    // For filtering
    const [filtered, setFiltered] = useState([]);
    const [petId, setPetId] = useState(null);
    const [petName, setPetName] = useState('');
    const [species, setSpecies] = useState('');
    const [vaccine, setVaccine] = useState('');
    const [doneOnly, setDoneOnly] = useState(false);
    const [notDoneOnly, setNotDoneOnly] = useState(false);
    // Fetch error
    const [fetchFail, setFetchFail] = useState(false);

    const fetch = useCallback(async () => {
        switch (due) {
            case "all":
                try {
                    const path = '/schedules';
                    const res = await axios.get(path);
                    setSchedules(res.data);
                    setFetchFail(false);
                } catch (err) {
                    setFetchFail(true);
                    console.error(err);
                };
                break;
            default:
                try {
                    const path = `/schedules/${due}`;
                    const res = await axios.get(path);
                    setSchedules(res.data);
                } catch (err) {
                    setFetchFail(true);
                    console.error(err);
                };
        };

    }, [due]);

    useEffect(() => {
        fetch()
    }, [due, fetch]);

    useEffect(() => {
        const filterStatus = (schedule) => {
            if (doneOnly) {
                return schedule.status;
            } else if (notDoneOnly) {
                return !schedule.status;
            } else {
                return true;
            };
        };
        const filterPetId = (schedule) => {
            if (!petId) {
                return true;
            } else {
                return schedule.Pet.id === petId;
            };
        };
        const filterPetName = (schedule) => {
            if (!petName) {
                return true;
            } else {
                return schedule.Pet.name.toUpperCase().includes(petName.toUpperCase());
            };
        };
        const filterSpecies = (schedule) => {
            if (!species) {
                return true;
            } else {
                return schedule.Pet.species.toUpperCase().includes(species.toUpperCase());
            };
        };
        const filterVaccine = (schedule) => {
            if (!vaccine) {
                return true;
            } else {
                return schedule.vaccine.toUpperCase().includes(vaccine.toUpperCase());
            };
        };
        setFiltered(schedules
            .filter(filterStatus)
            .filter(filterPetId)
            .filter(filterPetName)
            .filter(filterSpecies)
            .filter(filterVaccine)
        );
    }, [schedules, doneOnly, notDoneOnly, petId, petName, species, vaccine])

    const onPetIdChange = (e) => {
        setPetId(Number(e.target.value));
    };
    const onPetNameChange = (e) => {
        setPetName(e.target.value);
    };
    const onSpeciesChange = (e) => {
        setSpecies(e.target.value);
    };
    const onVacChange = (e) => {
        setVaccine(e.target.value);
    };
    const onDoneChange = () => {
        setDoneOnly(!doneOnly);
        if (doneOnly) {
            setNotDoneOnly(false);
        };
    };
    const onNotDoneChange = () => {
        setNotDoneOnly(!notDoneOnly);
        if (notDoneOnly) {
            setDoneOnly(false);
        };
    };
    const onShowPetIdChange = () => {
        setShowPetId(!showPetId);
    };
    const onShowSpeciesChange = () => {
        setShowSpecies(!showSpecies);
    };

    return (
        <>
            <h1>Schedules</h1>
            {fetchFail ? <FetchFail text="Schedules" /> : null}
            {!fetchFail && schedules.length === 0 ? <>
                <NoneFound text="Schedules" />
            </> : !fetchFail ? <>
                <div className="search">
                    <Input placeholder="Filter by Pet Name" onChange={onPetNameChange} />
                    <br />
                    <Input placeholder="Filter by Pet ID" onChange={onPetIdChange} />
                    <br />
                    <Input placeholder="Filter by Pet Species" onChange={onSpeciesChange} />
                    <br />
                    <Input placeholder="Filter by Vaccine Name" onChange={onVacChange} />
                    <br />
                </div>
                <ButtonGroup>
                    <Button onClick={() => setDue('all')} disabled={due === "all"}>All</Button>
                    <Button onClick={() => setDue('today')} disabled={due === "today"}>Today</Button>
                    <Button onClick={() => setDue('week')} disabled={due === "week"}>Week</Button>
                    <Button onClick={() => setDue('month')} disabled={due === "month"}>Month</Button>
                    <Button onClick={() => setDue('year')} disabled={due === "year"}>Year</Button>
                </ButtonGroup>
                <div style={{ textAlign: "left" }}>
                    <p>
                        <Checkbox onChange={onDoneChange} disabled={notDoneOnly ? true : false} /> Only Show Done Schedules
                        <br />
                        <Checkbox onChange={onNotDoneChange} disabled={doneOnly ? true : false} /> Only Show Not-Done Schedules
                        <br />
                        <Checkbox onChange={onShowPetIdChange} /> Show Pet ID
                        <Checkbox onChange={onShowSpeciesChange} /> Show Pet Species
                    </p>
                </div>
                <h2>Total Schedules: {filtered.length} ({due})</h2>
                <table>
                    <thead className="small-table-header">
                        <th>Vaccine</th>
                        {showPetId ? <th>Pet ID</th> : null}
                        <th>Pet Name</th>
                        {showSpecies ? <th>Species</th> : null}
                        <th>Date</th>
                        <th>Contact</th>
                        <th>Status</th>
                        {showEdit ? <th>Edit Date</th> : null}
                        {showEdit ? <th>Edit Status</th> : null}
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        <schedulesContext.Provider value={{ fetch, showEdit, setShowEdit, showPetId, showSpecies }}>
                            {filtered
                                .map(schedule => <Schedule key={schedule.id} schedule={schedule} />)}
                        </schedulesContext.Provider>
                    </tbody>
                </table>
            </> : null}
        </>
    )
};

export default Schedules;

// Material UI Table
/*
<TableContainer component={Paper}>
    <Table className={classes.table}>
        <TableHead>
            <TableRow>
                <TableCell align="center">Pet ID</TableCell>
                <TableCell align="center">Pet Name</TableCell>
                <TableCell align="center">Species</TableCell>
                <TableCell align="center">Vaccine</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Contact</TableCell>
                <TableCell align="center">Status</TableCell>
                {showEdit ? <TableCell align="center">Set Date</TableCell> : null}
                {showEdit ? <TableCell align="center">Set Status</TableCell> : null}
                <TableCell align="center">Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <schedulesContext.Provider value={{ fetch, showEdit, setShowEdit }}>
            {filtered.map(schedule => <Schedule key={schedule.id} schedule={schedule} />)}
            </schedulesContext.Provider>
        </TableBody>
    </Table>
</TableContainer>
*/