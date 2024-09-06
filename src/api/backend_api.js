import axios from 'axios';

const backendBaseUrl = 'http://127.0.0.1:8000/';
const backendUrls = {
    weekTask:'week_task/',
    datedTask: 'dated_task/'
};

export function getWeekTask(weekNum) {
    return axios.get(`${backendBaseUrl}${backendUrls.weekTask}?week_number=${weekNum}`)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error('error');
            console.error(error);
        })
}
