import { useState, useContext } from 'react';
import axios from '../config/axios';
import { customersContext } from './Customers';
import { TextField, ButtonGroup, Button } from '@material-ui/core';
import { Close, Edit, Save, Delete, KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';

function Customer({ customer }) {
    const [showPet, setShowPet] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editName, setEditName] = useState(customer.name);
    const [editContact, setEditContact] = useState(customer.contact);
    const [editAddress, setEditAddress] = useState(customer.address);

    const { fetch, setUpdating } = useContext(customersContext);

    const onEditNameChange = (e) => {
        setEditName(e.target.value);
    };
    const onEditContactChange = (e) => {
        setEditContact(e.target.value);
    };
    const onEditAddressChange = (e) => {
        setEditAddress(e.target.value);
    };

    const updateCustomer = async (id) => {
        try {
            setUpdating(true);
            await axios.put(`/customers/${id}`, {
                name: editName,
                contact: editContact,
                address: editAddress
            });
            setUpdating(false);
            console.log(`Customer ${id} successfully updated`)
            fetch();
        } catch (err) {
            console.error(`Failed to update customer ${id}`)
            console.error(err);
        };
    };
    const onClickUpdate = async (id) => {
        updateCustomer(id);
        setShowEdit(false);
    };
    const onClickDelete = async (id) => {
        try {
            await axios.delete(`/customers/${id}`);
            fetch();
        } catch (err) {
            console.error(err);
        };
    };

    return (<>
        <table>
            <thead>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Actions</th>
            </thead>
            <tbody>
                <tr>
                    <td>{customer.id}</td>
                    <td><strong>{customer.name}</strong></td>
                    <td>{customer.contact}</td>
                    <td>{customer.address}</td>
                    <td>
                        <ButtonGroup size="small" color="inherit">
                            <Button startIcon={<Edit />} onClick={() => setShowEdit(!showEdit)}></Button>
                            <Button startIcon={<Delete />} onClick={() => onClickDelete(customer.id)}>Delete</Button>
                        </ButtonGroup>
                        <br />
                        <Button size="small" color="inherit" startIcon={showPet ? <KeyboardArrowUp /> : <KeyboardArrowDown />} onClick={() => setShowPet(!showPet)}></Button>
                    </td>
                </tr>
            </tbody>
        </table>
        {showEdit ? <table>
            <thead className="edit-table-header">
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Actions</th>
            </thead>
            <tbody>
                <tr>
                    <td><TextField label="Edit Customer Name" onChange={onEditNameChange} value={editName} /></td>
                    <td><TextField label="Edit Customer Contact" onChange={onEditContactChange} value={editContact} /></td>
                    <td><TextField label="Customer Address" onChange={onEditAddressChange} value={editAddress} /></td>
                    <td><ButtonGroup size="small" color="inherit">
                        <Button startIcon={<Save />} onClick={() => onClickUpdate(customer.id)}>Save</Button>
                        <Button startIcon={<Close />} onClick={() => setShowEdit(false)}>Close</Button>
                    </ButtonGroup></td>
                </tr>
            </tbody>
        </table> : <></>}
        {showPet ? <>
            {customer.Pets.map(pet =>
                <table key={pet.id}>
                    <thead className="small-table-header">
                        <th>Customer ID</th>
                        <th>Pet ID</th>
                        <th>Pet Name</th>
                        <th>Species</th>
                        <th>Pet DOB</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{customer.id}</td>
                            <td>{pet.id}</td>
                            <td>{pet.name}</td>
                            <td>{pet.species}</td>
                            <td>{pet.dob}</td>
                        </tr>
                    </tbody>
                </table>)}
        </> : null}
    </>);
};

export default Customer;