import axios from 'axios';

export function getWeekTask(weekNum) {
    return axios.get('http://127.0.0.1:8000/week_task/')
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error('error');
            console.error(error);
        })
}
