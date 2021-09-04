function NoneFound({ text }) {
    return (
        <div className="status">
            <p className="green">Database Successfully Connected</p>
            <p>But No {text} Found in Records</p>
        </div>
    )
}

export default NoneFound