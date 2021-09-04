import { useState, useContext } from 'react';
import { Close, Edit, Save } from '@material-ui/icons';
import { Button, ButtonGroup, Checkbox } from '@material-ui/core';
import axios from '../config/axios';
import Picker from './Picker';
import { petContext } from './Pet';
import { petsContext } from './Pets';
import { petSchedulesContext } from './PetSchedules';

function PetSchedule({ schedule }) {

    const [editDate, setEditDate] = useState(schedule.date);
    const [editStatus, setEditStatus] = useState(schedule.status);

    const { setShowSchedule } = useContext(petContext);
    const { fetch, setUpdating } = useContext(petsContext);
    const { showEdit, setShowEdit } = useContext(petSchedulesContext);

    const onNewDateChange = (e) => {
        setEditDate(e.target.value);
    };
    const onEditStatusChange = (e) => {
        setEditStatus(!editStatus);
    }

    const updateSchedule = async (id) => {
        try {
            setUpdating(true);
            const body = {
                date: editDate,
                status: editStatus
            }
            await axios.put(`/schedules/${id}`, body);
            setUpdating(false);
            console.log(`Schedule ${id} successfully updated`);
            fetch();
        } catch (err) {
            console.error(`Failed to update schedule ${id}`);
            console.error(err);
        };

    };

    return (
        <>
            <tr className={schedule.status ? "done-schedule" : null}>
                <td>{schedule.vaccine}</td>
                <td>{schedule.date}</td>
                <td><Checkbox color="primary" checked={schedule.status} /></td>
                {showEdit ? <td><Picker label="Edit Date" value={editDate} onChange={onNewDateChange} /></td> : null}
                {showEdit ? <td><Checkbox onChange={onEditStatusChange} checked={editStatus} /></td> : null}
                {showEdit ? <td>
                    <ButtonGroup size="small">
                        <Button startIcon={<Save />} onClick={() => updateSchedule(schedule.id)}>Save</Button>
                        <Button startIcon={<Close />} onClick={() => setShowEdit(false)}>Cancel</Button>
                    </ButtonGroup>
                </td> : <td>
                    <ButtonGroup size="small">
                        <Button startIcon={<Edit />} onClick={() => setShowEdit(true)}>Edit</Button>
                        <Button startIcon={<Close />} onClick={() => setShowSchedule(false)}>Hide</Button>
                    </ButtonGroup>
                </td>}
            </tr>
        </>
    );
};

export default PetSchedule;

// Material UI Table
/*
<TableRow>
    <TableCell>{pet.name}</TableCell>
    <TableCell>{schedule.vaccine}</TableCell>
    <TableCell align="center">{schedule.date}</TableCell>
    <TableCell align="center"><Checkbox color="inherit" checked={schedule.status} /></TableCell>
    {showEdit ? <TableCell align="center"><Picker label="Edit Date" value={editDate} onChan {onNewDateChange} /></TableCell> : null}
    {showEdit ? <TableCell align="center"><Checkbox onChange={onEditStatusChange} check {editStatus} /></TableCell> : null}
    {showEdit ? <TableCell align="center">
        <ButtonGroup size="small">
            <Button startIcon={<Save />} onClick={() => onDone(schedule.id)}>Save</Button>
            <Button startIcon={<Close />} onClick={() => setShowEdit(false)}>Cancel</Button>
        </ButtonGroup>
    </TableCell> : <TableCell align="center">
        <ButtonGroup>
            <Button startIcon={<Edit />} onClick={() => setShowEdit(true)}>Edit Schedule</Button>
            <Button startIcon={<Close />} onClick={() => setShowSchedule(false)}>Hide Schedules</Button>
        </ButtonGroup>
    </TableCell>}
</TableRow>
*/