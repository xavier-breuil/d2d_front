export default function ChangeWeekButton({buttonText, handleClick}) {

    return (
        <div className="col-2">
            <button className="btn btn-secondary" onClick={handleClick}>{buttonText}</button>
        </div>
    )
}