import { useState, useEffect, createContext } from 'react';
import { Input } from '@material-ui/core';
import axios from '../config/axios';
import Customer from './Customer';
import FetchFail from './status/FetchFail';
import Updating from './status/Updating';
import NoneFound from './status/NoneFound';

export const customersContext = createContext(null);

function Customers() {

    const [custId, setCustId] = useState('');
    const [custName, setCustName] = useState('');
    const [customers, setCustomers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [fetchFail, setFetchFail] = useState(false);
    const [updating, setUpdating] = useState(false);

    const fetch = async () => {
        try {
            const path = "/customers";
            const res = await axios.get(path);
            setCustomers(res.data);
            setFetchFail(false);
        } catch (err) {
            setFetchFail(true);
            console.error(err);
        };
    };

    useEffect(() => {
        fetch();
    }, []);

    useEffect(() => {
        const filterCustId = (customer) => {
            if (!custId) {
                return true;
            } else {
                return customer.id === custId;
            };
        };
        const filterCustName = (customer) => {
            if (!custName) {
                return true;
            } else {
                return customer.name.toUpperCase().includes(custName.toUpperCase());
            };
        };
        setFiltered(customers
            .filter(filterCustId)
            .filter(filterCustName)
        );
    }, [customers, custId, custName]);

    const onIdChange = (e) => {
        setCustId(Number(e.target.value));
    };
    const onNameChange = (e) => {
        setCustName(e.target.value);
    };

    return (
        <>
            <h1>Customers</h1>
            {fetchFail ? <FetchFail text="Customers" /> : null}
            {!fetchFail && customers.length === 0 ? <>
                <NoneFound text="Customers" />
            </> : !fetchFail ? <>
                {updating ? <Updating text="Customers" /> : null}
                <div className="search">
                    <Input placeholder="Filter by Customer Name" onChange={onNameChange} />
                    <br />
                    <Input placeholder="Filter by Customer ID" onChange={onIdChange} />
                </div>
                <customersContext.Provider value={{ fetch, setUpdating }}>
                    {filtered.map(customer =>
                        <Customer key={customer.id} customer={customer} />
                    )}
                </customersContext.Provider>
            </> : null}
        </>
    );
};

export default Customers;
