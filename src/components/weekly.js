import { useState, useEffect } from 'react';

import moment from 'moment';

import {getWeekTask} from '../api/backend_api';

function Weekly() {
    // define state
    const [weekTasks, setWeekTasks] = useState([]);
    const [datedTasks, setDatedTasks] = useState([]);

    useEffect(() => {
        getWeekTask(moment().isoWeek())
            .then(tasks => {
                setWeekTasks(tasks.weeklyTask);
                setDatedTasks(tasks.datedTask);
            });
    },

        // no dependancies
        []
    )
    return (
        <div>
            <div>tasks for week {moment().isoWeek()}</div>
            {weekTasks.map(wt => {
                return <div key={wt.id}>{wt.name}</div>
            })}
            <div>dated tasks for week {moment().isoWeek()}</div>
            {datedTasks.map(dt => {
                return <div key={dt.id}>{dt.name}</div>
            })}
        </div>
    )
}

export default Weekly;