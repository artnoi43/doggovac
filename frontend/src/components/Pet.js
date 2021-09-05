import { useState, useContext, createContext } from 'react';
import { TextField, Button, ButtonGroup } from '@material-ui/core';
import { Close, Edit, Save, Delete, KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';
import axios from '../config/axios';
import PetSchedules from './PetSchedules';
import Picker from './Picker';
import { petsContext } from './Pets'

export const petContext = createContext(null);

function Pet({ pet }) {

    const [showSchedule, setShowSchedule] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editName, setEditName] = useState(pet.name);
    const [editDob, setEditDob] = useState(pet.dob);
    const [editNote, setEditNote] = useState(pet.note);

    const { fetch, setUpdating } = useContext(petsContext);

    const onEditNameChange = (e) => {
        setEditName(e.target.value);
    };
    const onEditDobChange = (e) => {
        setEditDob(e.target.value);
    };
    const onEditNoteChange = (e) => {
        setEditNote(e.target.value);
    };
    const updatePet = async (id) => {
        try {
            setUpdating(true);
            await axios.put(`/pets/${id}`, {
                name: editName,
                dob: editDob,
                note: editNote
            });
            setUpdating(false);
            console.log(`Pet ${id} successfully updated`);
            fetch();
        } catch (err) {
            console.error(`Failed to update pet ${id}`);
            console.error(err);
        };
    };
    const onClickUpdate = (id) => {
        updatePet(id);
        setShowEdit(false);
    };
    const onClickDelete = async (id) => {
        try {
            await axios.delete(`/pets/${id}`);
            console.log(`Delete pet ${id} successfully`);
            fetch();
        } catch (err) {
            console.error(`Failed to delete pet ${id}`);
            console.error(err);
        };
    };

    return (
        <>
            <table>
                <thead>
                    <th>Pet ID</th>
                    <th>Name</th>
                    <th>Species</th>
                    <th>DOB</th>
                    <th>Note</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Actions</th>
                </thead>
                <tbody>
                    <tr>
                        <td>{pet.id}</td>
                        <td><strong>{pet.name}</strong></td>
                        <td>{pet.species}</td>
                        <td>{pet.dob}</td>
                        <td>{pet.note}</td>
                        <td>{pet.Customer.name}</td>
                        <td>{pet.Customer.contact}</td>
                        <td>
                            <ButtonGroup size="small" color="inherit">
                                <Button startIcon={<Edit />} onClick={() => setShowEdit(!showEdit)}></Button>
                                <Button startIcon={<Delete />} onClick={() => onClickDelete(pet.id)}>Delete</Button>
                            </ButtonGroup>
                            <Button size="small" color="inherit" startIcon={showSchedule ? <KeyboardArrowUp /> : <KeyboardArrowDown />} onClick={() => setShowSchedule(!showSchedule)}></Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            {showEdit ? <>
                <table>
                    <thead className="edit-table-header">
                        <th>New Name</th>
                        <th>New DOB</th>
                        <th>New Note</th>
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td><TextField label="Edit Name" onChange={onEditNameChange} value={editName} /></td>
                            <td><Picker label="Date of Birth" onChange={onEditDobChange} value={editDob} /></td>
                            <td><TextField label="Edit Note" onChange={onEditNoteChange} value={editNote || ''} /></td>
                            <td><ButtonGroup size="small" color="inherit">
                                <Button startIcon={<Save />} onClick={() => onClickUpdate(pet.id)}>Save</Button>
                                <Button startIcon={<Close />} onClick={() => setShowEdit(false)}>Close</Button>
                            </ButtonGroup></td>
                        </tr>
                    </tbody>
                </table>
            </> : null}
            <petContext.Provider value={{ pet, setShowSchedule }}>
                {showSchedule ? <PetSchedules id={pet.id} schedules={pet.Schedules} /> : null}
            </petContext.Provider>
        </>
    );
};

export default Pet;
