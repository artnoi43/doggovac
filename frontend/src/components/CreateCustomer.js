import { useState } from 'react';
import { Button, TextField, TextareaAutosize } from '@material-ui/core';
import axios from '../config/axios';
import CreatePet from './CreatePet';
import Submitting from './status/Submitting';

function CreateCustomer() {

    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [fail, setFail] = useState(false);
    const [customerCreated, setCustomerCreated] = useState({});

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            const body = {
                name,
                contact,
                address
            };
            // Only send request when required fields are valid
            name && contact && await axios.post("/customers", body)
                .then(res => {
                    setSubmitting(false);
                    let { id, name, contact, address } = res.data;
                    // Done if res has id and name
                    id && setDone(true);
                    setCustomerCreated({
                        id,
                        name,
                        contact,
                        address
                    })
                })
                .catch(err => setFail(true));
        } catch (err) {
            setFail(true);
        };
    };

    const onNameChange = (e) => {
        setName(e.target.value);
    };
    const onContactChange = (e) => {
        setContact(e.target.value);
    };
    const onAddressChange = (e) => {
        setAddress(e.target.value);
    };

    return (
        <>
            {fail ? <>
                <h2 className="fail">Failed to create customer</h2>
            </> : done ? <>
                <h2 className="done">Customer created successfully</h2>
                <p><Button variant="outlined" onClick={() => setDone(false)}>Create another customer</Button></p>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Customer Contact</th>
                        <th>Customer Address</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{customerCreated.id}</td>
                            <td>{customerCreated.name}</td>
                            <td>{customerCreated.contact}</td>
                            <td>{customerCreated.address}</td>
                        </tr>
                    </tbody>
                </table>
                <CreatePet />
            </> : <>
                <h1>Create Customer</h1>
                <p>Enter customer information in the form below. Required fields are customer name and contact information<br />After 'Create Pet' button is clicked, it may take a few seconds to create the customer in the database. Customer must be created before their pets.</p>
                <div style={{ padding: "14px" }}>
                    <form onSubmit={onSubmit}>
                        <p>Name</p>
                        <TextField label="Required" placeholder="Customer Name" onChange={onNameChange} />
                        <p>Contact</p>
                        <TextField label="Required" placeholder="Customer Contact" onChange={onContactChange} />
                        <p>Customer Address</p>
                        <TextareaAutosize placeholder="Optional" minRows={3} onChange={onAddressChange} />
                        <h2>Submit</h2>
                        <input type="submit" />
                    </form>
                </div>
                {submitting ? <Submitting text="Customer" /> : null}
            </>}
        </>
    );
};

export default CreateCustomer;
