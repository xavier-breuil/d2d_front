import moment from 'moment';

function Weekly() {
    return (
        <div>week {moment().isoWeek()}</div>
    )
}

export default Weekly;