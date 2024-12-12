import { useEffect, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Stacks from 'react-bootstrap/Stack';

import { emptyString, correctWeekYear, isDate } from '../utils/functions';
import { getLabels, createTask } from '../api/backend_api';

const Task = () => {
    const [taskType, setTaskType] = useState('date');
    const [dateTaskForm, setDateTaskForm] = useState([{name:'', date:'', done: false}]);
    const [weekTaskForm, setWeekTaskForm] = useState([{name:'', week:'', year: '', done: false}]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        getLabels()
            .then(labelList => {
                setLabels(labelList);
            })
            .catch(error => {
                console.log(error);
                displayAlert(true, 'danger', 'Erreur lors de la récupération des étiquettes');
            })
    },

    [])

    const typeChanged = event => {
        setTaskType(event.target.value);
    }

    const dateNameChanged = (event, index) => {
        const newTasks = dateTaskForm.map((task, i) => {
            if (i === index) {
                return {date: task.date, name: event.target.value, done: false};
            } else {
                return task;
            }
        })
        setDateTaskForm(newTasks);
    }

    const weekNameChanged = (event, index) => {
        const newTasks = weekTaskForm.map((task, i) => {
            if (i === index) {
                return {week: task.week, year: task.year, name: event.target.value, done: false};
            } else {
                return task;
            }
        })
        setWeekTaskForm(newTasks);
    }

    const weekChanged = (event, index) => {
        const newTasks = weekTaskForm.map((task, i) => {
            if (i === index) {
                return {week: event.target.value, year: task.year, name: task.name, done: false};
            } else {
                return task;
            }
        })
        setWeekTaskForm(newTasks);
    }

    const yearChanged = (event, index) => {
        const newTasks = weekTaskForm.map((task, i) => {
            if (i === index) {
                return {week: task.week, year: event.target.value, name: task.name, done: false};
            } else {
                return task;
            }
        })
        setWeekTaskForm(newTasks);
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

    const validateTaskNames = () => {
        if (taskType === 'date') {
            return dateTaskForm.every(task => {
                return !emptyString(task.name);
            })
        }
        if (taskType === 'week') {
            return weekTaskForm.every(task => {
                return !emptyString(task.name);
            })
        }
    }

    const validateDateTaskDates = () => {
        return dateTaskForm.every(task => {
            return isDate(task.date);
        })
    }

    const validateWeekTaskWeekYear = () => {
        return weekTaskForm.every(task => {
            return correctWeekYear(task.week, task.year);
        })
    }

    const formatWeekData = task => {
        return {
            name: task.name,
            year: task.year,
            week_number: task.week,
            done: task.done
        }
    }

    const validateAndPost = (event) => {
        event.preventDefault();
        // Check for errors in form
        const fieldErrors = [];
        if (!validateTaskNames()) {
            fieldErrors.push('le nom d\'au moins une tâche est non valide');
        }
        if (taskType === 'date') {
            if (!validateDateTaskDates()) {
                fieldErrors.push('La date d\'au moins une tâche est incorrecte');
            }
        }
        if (taskType === 'week') {
            if (!validateWeekTaskWeekYear()) {
                fieldErrors.push('La date d\'au moins une tâche est incorrecte');
            }
        }
        if (fieldErrors.length > 0) {
            displayAlert(true, 'danger', `Erreur sur le formulaire: ${fieldErrors.join(', ')}`);
            return;
        } else {
            displayAlert(false, 'danger', '');
        }

        // Post data on backend
        const taskPromises = [];
        if (taskType === 'date') {
            dateTaskForm.map(data => {
                taskPromises.push(createTask('date', data));
            });
        } else if (taskType === 'week') {
            weekTaskForm.map(data => {
                taskPromises.push(createTask('week', formatWeekData(data)));
            });
        }
        Promise.all(taskPromises)
            .then(
                responses => {
                    if (responses.every(resp => resp.status === 201)) {
                        displayAlert(true, 'success', 'Les tâches ont bien été créées');
                        resetForm();
                    } else {
                        displayAlert(true, 'danger', `Erreur lors de l'envoie des données, certaines taches n'ont peut être pas été crées`);
                    }
                }
            ).catch(error => {
                console.log(error);
                displayAlert(true, 'danger', `Erreur lors de l'envoie des données, certaines taches n'ont peut être pas été crées`);
            });
    }

    const resetForm = ()=> {
        setDateTaskForm([{name:'', date:'', done: false}]);
        setWeekTaskForm([{name:'', year:'', week: '', done: false}]);
    }

    const keyDown = event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    }

    const addTask = () => {
        if (taskType === 'date') {
            setDateTaskForm([...dateTaskForm,{name:'', date:'', done: false}]);
        }
        if (taskType === 'week') {
            setWeekTaskForm([...weekTaskForm,{name:'', week:'', year: '', done: false}]);
        }
    }

    const deleteDatedTask = index => {
        setDateTaskForm(dateTaskForm.filter((_, i) => {return i !== index}));
    }

    const deleteWeekTask = index => {
        setWeekTaskForm(weekTaskForm.filter((_, i) => {return i !== index}));
    }

    const displayAlert = (show, type, message) => {
        setShowAlert(show);
        setAlertMessage(message);
        setAlertType(type);
        window.scrollTo(0,0);
    }

    return (
        <div>
            {showAlert &&
                <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>
            }
            <Form className="ms-4" onSubmit={validateAndPost} onKeyDown={keyDown}>
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
                            <Row key={'date_task_row_' + index} className="mb-2 align-items-end">
                                <Form.Group as={Col} className="text-start" controlId="taskDate">
                                    <Form.Label>Date:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        onChange={event => dateChanged(event, index)}
                                        value={task.date}/>
                                </Form.Group>
                                <Form.Group as={Col} className="text-start" controlId="taskName">
                                    <Form.Label>Nom de la tâche</Form.Label>
                                    <Form.Control
                                        onChange={event => dateNameChanged(event, index)}
                                        value={task.name}/>
                                </Form.Group>
                                <Form.Group as={Col} className="text-start" controlId="datedTaskDelete">
                                    <Button
                                        variant="outline-danger"
                                        onClick={event => deleteDatedTask(index)}>
                                            <i className="bi bi-trash"></i>
                                    </Button>
                                </Form.Group>
                                <Form.Group className="text-start">
                                    <Form.Label>
                                        Etiquettes:
                                    </Form.Label>
                                    <Stacks
                                        direction="horizontal"
                                        gap="1"
                                        className="mb-4">
                                        {labels.map(label => {
                                            return <Button
                                                key={'label-button-' + label.id}
                                                size="sm">
                                                {label.name}
                                            </Button>
                                        })}
                                    </Stacks>
                                </Form.Group>
                            </Row>)
                        })
                }
                {taskType === 'week' &&
                    weekTaskForm.map((task, index) => { return(
                        <Row key={'week_task_row_' + index} className="align-items-end">
                                <Form.Group as={Col} className="mb-4 text-start" controlId="taskYear">
                                    <Form.Label>Année:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        onChange={event => yearChanged(event, index)}
                                        value={task.year}/>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-4 text-start" controlId="taskWeek">
                                    <Form.Label>Semaine:</Form.Label>
                                    <Form.Control
                                        placeholder="entre 1 et 53"
                                        type="number"
                                        onChange={event => weekChanged(event, index)}
                                        value={task.week}/>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-4 text-start" controlId="taskName">
                                    <Form.Label>Nom de la tâche</Form.Label>
                                    <Form.Control
                                        onChange={event => weekNameChanged(event, index)}
                                        value={task.name}/>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-4 text-start" controlId="weekTaskDelete">
                                    <Button
                                        variant="outline-danger"
                                        onClick={event => deleteWeekTask(index)}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                </Form.Group>
                            </Row>)
                    })
                }
                <Button onClick={addTask} className="mx-2">
                    <i className="bi bi-plus-lg"></i>
                </Button>
                <Button type="submit" className="mx-2">
                    Créer
                </Button>
            </Form>
            <div className="ms-4 text-start">*: Vous pouvez utiliser [Entrer] depuis un champ du formulaire pour ajouter une nouvelle tâche</div>
        </div>
        )
}

export default Task;