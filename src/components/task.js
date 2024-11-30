import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { emptyString, correctWeekYear, isDate } from '../utils/functions';
import { createTask } from '../api/backend_api';

const Task = () => {
    const [taskType, setTaskType] = useState('date');
    const [dateTaskForm, setDateTaskForm] = useState([{name:'', date:'', done: false}]);
    // const [taskName, setTaskName] = useState('');
    const [taskWeek, setTaskWeek] = useState('');
    const [taskYear, setTaskYear] = useState('');
    // const [taskDate, setTaskDate] = useState('');
    const [formError, setFormError] = useState([]);
    const [createSucess, setCreateSuccess] = useState(false);

    const typeChanged = event => {
        setTaskType(event.target.value);
    }

    const nameChanged = (event, index) => {
        const newTasks = dateTaskForm.map((task, i) => {
            if (i === index) {
                return {date: task.date, name: event.target.value};
            } else {
                return task;
            }
        })
        setDateTaskForm(newTasks);
    }

    const weekChanged = event => {
        setTaskWeek(event.target.value);
    }

    const yearChanged = event => {
        setTaskYear(event.target.value);
    }

    const dateChanged = (event, index) => {
        const newTasks = dateTaskForm.map((task, i) => {
            if (i === index) {
                return {name: task.name, date: event.target.value};
            } else {
                return task;
            }
        })
        setDateTaskForm(newTasks);
    }

    const validateDateTaskNames = () => {
        return dateTaskForm.every(task => {
            return !emptyString(task.name);
        })
    }

    const validateDateTaskDates = () => {
        return dateTaskForm.every(task => {
            return isDate(task.date);
        })
    }

    const validateAndPost = (event) => {
        event.preventDefault();
        // TODO: handle case of week task
        // Check for errors in form
        const fieldErrors = [];
        if (taskType === 'date') {
            if (!validateDateTaskNames()) {
                fieldErrors.push('le nom d\'au moins une tache est non valide');
            }
            if (!validateDateTaskDates()) {
                fieldErrors.push('La date d\'au moins une tache est incorrecte');
            }
        }
        // if (emptyString(taskName)) {
        //     fieldErrors.push('nom de la tache non valide');
        // }
        // if (taskType === 'week') {
        //     if (!correctWeekYear(taskWeek, taskYear)) {
        //         fieldErrors.push('semaine ou année incorrecte');
        //     }
        // }
        // if (taskType === 'date' && !isDate(taskDate)) {
        //     fieldErrors.push('date incorrecte');
        // }
        if (fieldErrors.length > 0) {
            setFormError(`Erreur sur le formulaire: ${fieldErrors.join(', ')}`)
            return;
        } else {
            setFormError('');
        }

        if (taskType === 'date') {
            const dateTaskPromises = dateTaskForm.map(data => {
                return createTask('date', data);
            });
            Promise.all(dateTaskPromises)
                .then(
                    responses => {
                        if (responses.every(resp => resp.status === 201)) {
                            setCreateSuccess(true);
                            resetDateForm();
                        } else {
                            setFormError(`Erreur lors de l'envoie des données, certaines taches n'ont peut être pas été crées`);
                        }
                    }
                ).catch(error => {
                    console.log(error);
                    setFormError(`Erreur lors de l'envoie des données, certaines taches n'ont peut être pas été crées`);
                })
        }

        // const data = {
        //     name: taskName,
        //     done: false
        // }
        // if (taskType === 'week') {
        //     data.week_number = taskWeek;
        //     data.year = taskYear;
        // }
        // if (taskType === 'date') {
        //     data.date = taskDate;
        // }
        // createTask(taskType, data).then(
        //     response => {
        //         if (response.status === 201) {
        //             setCreateSuccess(true);
        //             resetForm();
        //         } else {
        //             setFormError(`Erreur lors de l'envoie des données`);
        //         }
        //     }
        // ).catch(error => {
        //     setFormError(`Erreur lors de l'envoie des données`);
        // })
    }

    const resetDateForm = ()=> {
        setDateTaskForm([{name:'', date:'', done: false}]);
    }

    const resetForm = ()=> {
        setTaskWeek('');
        setTaskYear('');
    }

    const keyDown = event => {
        if (taskType === 'date' && event.key === 'Enter') {
            event.preventDefault();
            addDateTask();
        }
    }

    const addDateTask = () => {
        setDateTaskForm([...dateTaskForm,{name:'', date:''}]);
    }

    const deleteDatedTask = index => {
        setDateTaskForm(dateTaskForm.filter((_, i) => {return i !== index}));
    }

    return (
        <div className="ms-4">
            <Form onSubmit={validateAndPost} onKeyDown={keyDown}>
                {formError.length > 0 &&
                    <Alert variant="danger" onClose={() => setFormError('')} dismissible>{formError}</Alert>
                }
                {createSucess &&
                    <Alert variant="success" onClose={() => setCreateSuccess(false)} dismissible>Les tâches ont bien été créées</Alert>
                }
                <Row>
                    <div key="inline-radios" className="my-4 text-start">
                        <Form.Check
                            inline
                            label="semaine"
                            name="taskType"
                            type="radio"
                            id="week-radio"
                            value="week"
                            checked={taskType === 'week'}
                            onChange={typeChanged}
                        />
                        <Form.Check
                            inline
                            label="date"
                            name="taskType"
                            type="radio"
                            id="date-radio"
                            value="date"
                            checked={taskType === 'date'}
                            onChange={typeChanged}
                        />
                    </div>
                </Row>
                {taskType === 'date' &&
                        dateTaskForm.map((task, index) => { return (
                            <Row key={'date_task_row_' + index} className="align-items-end">
                                <Form.Group as={Col} className="mb-4 text-start" controlId="taskDate">
                                    <Form.Label>Date:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        onChange={event => dateChanged(event, index)}
                                        value={task.date}/>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-4 text-start" controlId="taskName">
                                    <Form.Label>Nom de la tâche</Form.Label>
                                    <Form.Control
                                        onChange={event => nameChanged(event, index)}
                                        value={task.name}/>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-4 text-start" controlId="taskDelete">
                                    <Button
                                        variant="outline-danger"
                                        onClick={event => deleteDatedTask(index)}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                </Form.Group>
                            </Row>)
                        })
                }
                {taskType === 'week' &&
                    <Row>
                        <Form.Group className="m-4 col-lg-6 text-start" controlId="taskWeek">
                            <Form.Label>Semaine:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="numéro de la semaine (entre 1 et 53)"
                                onChange={weekChanged}
                                value={taskWeek}/>
                        <Form.Label>Année:</Form.Label>
                            <Form.Control
                                type="number"
                                onChange={yearChanged}
                                value={taskYear}/>
                        </Form.Group>
                    </Row>
                }
                <Button onClick={addDateTask} className="mx-2">
                    <i className="bi bi-plus-lg"></i>
                </Button>
                <Button type="submit" className="mx-2">
                    Créer
                </Button>
            </Form>
            <div className="text-start">*: Vous pouvez utiliser [Entrer] depuis un champ du formulaire pour ajouter une nouvelle tâche</div>
        </div>
        )
}

export default Task;