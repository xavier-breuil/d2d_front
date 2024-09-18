import axios from 'axios';

const backendBaseUrl = 'http://127.0.0.1:8000/';
const backendUrls = {
    weekTask:'week_task/',
    datedTask: 'dated_task/'
};

export function getWeekTask(weekNum) {
    let weeklyTask = [];
    let datedTask = [];
    return axios.get(`${backendBaseUrl}${backendUrls.weekTask}?week_number=${weekNum}`)
        .then(response => {
            weeklyTask = response.data.results;
        })
        .then(() => {
            return axios.get(`${backendBaseUrl}${backendUrls.datedTask}?week=${weekNum}`)
        })
        .then(response => {
            datedTask = response.data.results;
            return {weeklyTask, datedTask}
        })
        .catch(error => {
            console.error(error);
        })
}
