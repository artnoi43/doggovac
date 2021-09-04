import { useState, useContext, createContext } from 'react';
import { petContext } from './Pet';
import PetSchedule from './PetSchedule';

export const petSchedulesContext = createContext(null);

function PetSchedules({ schedules }) {
    const [showEdit, setShowEdit] = useState(false);

    const { pet } = useContext(petContext);

    return (
        <>
            <table>
                <caption>Vaccination Schedules for {pet.name}</caption>
                <tbody>
                    <tr className="small-table-header">
                        <th>Vaccine</th>
                        <th>Date</th>
                        <th>Status</th>
                        {showEdit ? <th>Set Date</th> : null}
                        {showEdit ? <th>Set Status</th> : null}
                        <th>Actions</th>
                    </tr>
                    <petSchedulesContext.Provider value={{ showEdit, setShowEdit }}>
                        {schedules.map((schedule) => <PetSchedule key={schedule.id} schedule={schedule} />)}
                    </petSchedulesContext.Provider>
                </tbody>
            </table>
        </>
    );
};

export default PetSchedules;

// Matrial UI Table
/*
<TableContainer component={Paper}>
    <Table className={classes.table} aria-label={`Schedules for ${pet.name}`}>
        <TableHead>
            <TableRow>
                <TableCell align="center">Pet Name</TableCell>
                <TableCell align="center">Vaccine</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Status</TableCell>
                {showEdit ? <TableCell align="center">New Date</TableCell> : null}
                {showEdit ? <TableCell align="center">Set Status</TableCell> : null}
                <TableCell align="center">Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
        <petSchedulesContext.Provider value={{ showEdit, setShowEdit }}>
            {schedules.map((schedule) => <PetSchedule key={schedule.id} schedule={schedule} />)}
        </petSchedulesContext.Provider>
        </TableBody>
    </Table>
</TableContainer>
*/
