import axios from 'axios';

const backendBaseUrl = 'http://127.0.0.1:8000/';
const backendUrls = {
    weekTask:'week_task/',
    datedTask: 'dated_task/',
    label: 'label/',
    lateTask: 'late_tasks',
    mot: 'multi_occurences_task/'
};

export const getWeekTask = (weekNum, year) => {
    let weeklyTask = [];
    let datedTask = [];
    let lateTask = [];
    return axios.get(`${backendBaseUrl}${backendUrls.weekTask}?week_number=${weekNum}&year=${year}`)
        .then(response => {
            weeklyTask = response.data.results;
            return axios.get(`${backendBaseUrl}${backendUrls.datedTask}?week=${weekNum}&year=${year}`)
        })
        .then(response => {
            datedTask = response.data.results;
            return axios.get(`${backendBaseUrl}${backendUrls.lateTask}`)
        })
        .then(response => {
            lateTask = response.data.late_tasks;
            return {weeklyTask, datedTask, lateTask}
        })
        .catch(error => {
            console.error(error);
        })
}

export const createTask = (taskType, data) => {
    if (taskType === 'week') {
        return axios.post(
            `${backendBaseUrl}${backendUrls.weekTask}`,
            data)
    }
    if (taskType === 'date'){
        return axios.post(
            `${backendBaseUrl}${backendUrls.datedTask}`,
            data)
    }
}

export const updateTask = (taskType, taskId, data) => {
    if (taskType === 'date'){
        return axios.patch(
            `${backendBaseUrl}${backendUrls.datedTask}${taskId}/`,
            data)
    }
}

export const getMots = () => {
    return axios.get(`${backendBaseUrl}${backendUrls.mot}`)
        .then(response => {
            return response.data.results;
        })
}

export const updateMot = (motId, data) => {
    return axios.patch(
        `${backendBaseUrl}${backendUrls.mot}${motId}/`, data
    )
}

export const createMot = data => {
    return axios.post(
        `${backendBaseUrl}${backendUrls.mot}`, data
    )
}

export const deleteDatedTask = taskId => {
    return axios.delete(
        `${backendBaseUrl}${backendUrls.datedTask}${taskId}/`
    )
}

export const deleteWeekTask = taskId => {
    return axios.delete(
        `${backendBaseUrl}${backendUrls.weekTask}${taskId}/`
    )
}

export const deleteMot = motId => {
    return axios.delete(
        `${backendBaseUrl}${backendUrls.mot}${motId}/`
    )
}

export const markAsDoneTask = (taskId, taskDone, taskType) => {
    if (taskType === 'date') {
        return axios.patch(
            `${backendBaseUrl}${backendUrls.datedTask}${taskId}/`, {done: taskDone}
        )
    }
    if (taskType === 'week') {
        return axios.patch(
            `${backendBaseUrl}${backendUrls.weekTask}${taskId}/`, {done: taskDone}
        )
    }
}

export const getLabels = () => {
    return axios.get(`${backendBaseUrl}${backendUrls.label}`)
        .then(response => {
            return response.data.results;
        })
}

export const patchLabel = label => {
    const id = label.id;
    delete label.id;
    return axios.patch(
        `${backendBaseUrl}${backendUrls.label}${id}/`, {name: label.name}
    );
}

export const createLabel = label => {
    return axios.post(
        `${backendBaseUrl}${backendUrls.label}`, {name: label.name}
    );
}

export const deleteLabel = label => {
    return axios.delete(
        `${backendBaseUrl}${backendUrls.label}${label.id}/`
    );
}
