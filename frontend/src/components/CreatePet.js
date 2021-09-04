import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormControl, InputLabel, Button, TextField, TextareaAutosize, Select, MenuItem } from '@material-ui/core';
import axios from '../config/axios';
import Picker from './Picker';
import Submitting from './status/Submitting';

function CreatePet() {

    const [name, setName] = useState('');
    const [dob, setDob] = useState(undefined);
    const [species, setSpecies] = useState('');
    const [note, setNote] = useState('');
    const [custId, setCustId] = useState('');
    const [custName, setCustName] = useState('');
    const [done, setDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [fail, setFail] = useState(false);
    const [petCreated, setPetCreated] = useState({});
    // Fetched customers from database
    const [customers, setCustomers] = useState([]);
    const [filteredCustomer, setFilteredCustomer] = useState([]);

    const petSpecies = ["Dog", "Cat"];

    useEffect(() => {
        const fetch = async () => {
            try {
                const path = "/customers"
                const res = await axios.get(path);
                setCustomers(res.data);
            } catch (err) {
                console.error(err);
            };
        };
        fetch();
    }, []);

    // Filter customer name
    useEffect(() => {
        setFilteredCustomer(
            customers.filter(customer => {
                return customer.name.toUpperCase().includes(custName.toUpperCase());
            })
        );
    }, [customers, custName]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const body = {
                name,
                dob,
                species,
                note,
                custId,
            };
            // Only send request if required fields are valid
            name && dob && custId && await axios.post("/pets", body)
                .then(res => {
                    setSubmitting(false);
                    let { id, name, species, dob, custId, Customer } = res.data;
                    // Done if res has id
                    id && setDone(true);
                    setPetCreated({
                        id,
                        name,
                        species,
                        dob,
                        custId,
                        custName: Customer.name
                    })
                });
        } catch (err) {
            setFail(true);
        };
    };

    const onNameChange = (e) => {
        setName(e.target.value);
    };
    const onDobChange = (e) => {
        setDob(e.target.value);
    };
    const onSpeciesChange = (e) => {
        setSpecies(e.target.value);
    };
    const onNoteChange = (e) => {
        setNote(e.target.value);
    };
    const onOwnerIdChange = (e) => {
        setCustId(e.target.value);
    };
    const onCustNameChange = (e) => {
        setCustName(e.target.value);
    };

    return (
        <>
            {fail ? <>
                <h2 className="fail">Failed to create pet</h2>
            </> : done ? <>
                <h2 className="done">Pet created successfully</h2>
                <p><Button variant="outlined" onClick={() => setDone(false)}>Create Another Pet</Button></p>
                <table>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Pet Name</th>
                            <th>Species</th>
                            <th>DOB</th>
                            <th>Cust. ID</th>
                            <th>Cust. Name</th>
                        </tr>
                        <tr>
                            <td>{petCreated.id}</td>
                            <td>{petCreated.name}</td>
                            <td>{petCreated.species}</td>
                            <td>{petCreated.dob}</td>
                            <td>{petCreated.custId}</td>
                            <td>{petCreated.custName}</td>
                        </tr>
                    </tbody>
                </table>
            </> : <>
                <h1>Create Pet</h1>
                <p>Enter pet information in the form below. Required fields are pet name, date of birth, and customer (pet owner).<br />After 'Create Pet' button is clicked, it may take a few seconds to create the pet in the database. The vaccination schedules are also created on this step.</p>
                <div style={{ padding: "14px" }}>
                    <form onSubmit={onSubmit}>
                        {customers.length === 0 ? <p className="fail">No customer found. Please <Link to="/create-customer">create customer</Link> before their pets.</p> : null}
                        <h2>Name</h2>
                        <TextField label="Required" placeholder="Pet Name" onChange={onNameChange} />
                        <h2>Date of Birth</h2>
                        <Picker onChange={onDobChange} />
                        <h2>Customer</h2>
                        <FormControl>
                            <TextField label="Filter Customer By Name" placeholder="Customer Name" onChange={onCustNameChange} />
                        </FormControl>
                        <br />
                        <FormControl>
                            <InputLabel>Select Customer</InputLabel>
                            <Select
                                style={{ minWidth: 200 }}
                                id="customer-selector"
                                onChange={onOwnerIdChange}
                            >
                                {filteredCustomer.map(cust => {
                                    return <MenuItem key={cust.id} value={cust.id}>{cust.name} (ID: {cust.id})</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <h2>Species</h2>
                        <FormControl>
                            <InputLabel>Default: Dog</InputLabel>
                            <Select
                                style={{ minWidth: 200 }}
                                id="species-selector"
                                onChange={onSpeciesChange}
                            >
                                {petSpecies.map(s => {
                                    return <MenuItem key={s} value={s}>{s}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <h2>Pet Notes</h2>
                        <TextareaAutosize placeholder="optional" minRows={3} onChange={onNoteChange} />
                        <blockquote>Once created, the pet's Owner ID and its species cannot be changed. You must delete and re-create the pet to do so.</blockquote>
                        <h2>Create Pet</h2>
                        <input type="submit" />
                    </form>
                </div>
                {submitting ? <Submitting text="Pet" /> : null}
            </>}
        </>
    )
};

export default CreatePet;