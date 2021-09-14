import TextField from '@material-ui/core/TextField';

function Picker({ label, onChange, value }) {
    return (
        <TextField
            type="date"
            label={label}
            onChange={onChange}
            value={value}
        />
    );
};

export default Picker;
