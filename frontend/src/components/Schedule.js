import { useState, useContext } from 'react';
import { Button, ButtonGroup, Checkbox } from '@material-ui/core';
import { Save, Close } from '@material-ui/icons';
import axios from '../config/axios';
import { schedulesContext } from './Schedules';
import Picker from './Picker';

function Schedule({ schedule }) {

    const [updating, setUpdating] = useState(false);
    const [editDate, setEditDate] = useState(schedule.date);
    const [editStatus, setEditStatus] = useState(schedule.status);
    const { fetch, showEdit, setShowEdit, showPetId, showSpecies } = useContext(schedulesContext);

    const onEditDateChange = (e) => {
        setEditDate(e.target.value);
    };

    const onEditStatusChange = (e) => {
        setEditStatus(!editStatus)
    };

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
            {updating ? <p className="green">Updating data</p> : null}
            <tr className={schedule.status ? "done-schedule" : null}>
                {showPetId ? <td>{schedule.petId}</td> : null}
                <td><strong>{schedule.Pet.name}</strong></td>
                {showSpecies ? <td>{schedule.Pet.species}</td> : null}
                <td>{schedule.Pet.Customer.contact}</td>
                <td>{schedule.vaccine}</td>
                <td>{schedule.date}</td>
                <td><Checkbox color="primary" checked={schedule.status} /></td>
                {showEdit ? <td><Picker value={editDate} onChange={onEditDateChange} /></td> : null}
                {showEdit ? <td><Checkbox onChange={onEditStatusChange} checked={editStatus} /></td> : null}
                <td>{showEdit ? <ButtonGroup size="small">
                    <Button startIcon={<Save />} onClick={() => updateSchedule(schedule.id)}>Save</Button>
                    <Button startIcon={<Close />} onClick={() => setShowEdit(false)}></Button>
                </ButtonGroup> : <ButtonGroup size="small">
                    <Button onClick={() => setShowEdit(!showEdit)}>Edit</Button>
                </ButtonGroup>}</td>
            </tr>
        </>
    );
};

export default Schedule;

// Material UI Table
/*
<TableRow>
    <TableCell align="center">{schedule.petId}</TableCell>
    <TableCell align="center"><strong>{schedule.Pet.name}</strong></TableCell>
    <TableCell align="center">{schedule.Pet.species}</TableCell>
    <TableCell align="center">{schedule.vaccine}</TableCell>
    <TableCell align="center">{schedule.date}</TableCell>
    <TableCell align="center">{schedule.Pet.Customer.contact}</TableCell>
    <TableCell align="center"><Checkbox color="inherit" checked={schedule.status} /></TableCell>
    {showEdit ? <TableCell align="center">
        <Picker value={editDate} onChange={onEditDateChange} />
    </TableCell> : null}
    {showEdit ? <TableCell align="center">
        <Checkbox onChange={onEditStatusChange} checked={editStatus} />
    </TableCell> : null}
    <TableCell align="center">
        {showEdit ? <ButtonGroup size="small">
            <Button startIcon={<Save />} onClick={() => updateSchedule(schedule.id)}>Save</Button>
            <Button startIcon={<Close />} onClick={() => setShowEdit(false)}></Button>
        </ButtonGroup>
        : <Button onClick={() => setShowEdit(!showEdit)}>Edit</Button>
        }
    </TableCell>
</TableRow>
*/