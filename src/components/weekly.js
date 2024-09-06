import moment from 'moment';

import {getWeekTask} from '../api/backend_api';

function Weekly() {
    getWeekTask(moment().isoWeek());
    return (
        <div>week {moment().isoWeek()}</div>
    )
}

export default Weekly;