import { useState, useEffect, createContext } from 'react';
import { Input, Checkbox } from '@material-ui/core';
import axios from '../config/axios';
import Pet from './Pet';
import FetchFail from './status/FetchFail';
import NoneFound from './status/NoneFound';
import Updating from './status/Updating';

export const petsContext = createContext(null);

function Pets() {

    const [petId, setPetId] = useState('');
    const [petName, setPetName] = useState('');
    const [pets, setPets] = useState([]);
    const [showPetId, setShowPetId] = useState(false);
    const [showSpecies, setShowSpecies] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const [fetchFail, setFetchFail] = useState(false);
    const [updating, setUpdating] = useState(false);

    const fetch = async () => {
        try {
            const path = "/pets"
            const res = await axios.get(path);
            setPets(res.data);
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
        const filterPetId = (pet) => {
            if (!petId) {
                return true;
            } else {
                return pet.id === petId
            };
        };
        const filterPetName = (pet) => {
            if (!petName) {
                return true;
            } else {
                return pet.name.toUpperCase().includes(petName.toUpperCase())
            };
        };
        setFiltered(pets
            .filter(filterPetId)
            .filter(filterPetName)
        );
    }, [pets, petId, petName]);

    const onIdChange = (e) => {
        setPetId(Number(e.target.value));
    };
    const onNameChange = (e) => {
        setPetName(e.target.value);
    };
    const onShowPetIdChange = () => {
        setShowPetId(!showPetId);
    };
    const onShowSpeciesChange = () => {
        setShowSpecies(!showSpecies);
    };

    return (
        <>
            <h1>Pets</h1>
            {fetchFail ? <FetchFail text="Pets" /> : null}
            {!fetchFail && pets.length === 0 ? <>
                <NoneFound text="Pets" />
            </> : !fetchFail ? <>
                {updating ? <Updating text="Pets" /> : null}
                <div className="search">
                    <Input placeholder="Filter by Pet Name" onChange={onNameChange} />
                    <br />
                    <Input placeholder="Filter by Pet ID" onChange={onIdChange} />
                </div>
                <div style={{ textAlign: "left" }}>
                    <Checkbox onChange={onShowPetIdChange} /> Show Pet ID
                    <br />
                    <Checkbox onChange={onShowSpeciesChange} /> Show Pet Species
                </div>
                <petsContext.Provider value={{ fetch, setUpdating, showPetId, showSpecies }}>
                    {filtered
                        .map(pet => <Pet key={pet.id} pet={pet} />)
                    }
                </petsContext.Provider>
            </> : null}
        </>
    );
};

export default Pets;
