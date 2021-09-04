function FetchFail({ text }) {
    return (
        <div className="status-fail">
            <h2 className="fail">Database Connection Failure</h2>
            <h2 className="fail">Could Not Fetch {text}</h2>
        </div>
    )
}

export default FetchFail
