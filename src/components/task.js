import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { emptyString, correctWeekYear, isDate } from '../utils/functions';

const Task = () => {
    const [taskType, setTaskType] = useState('date');
    const [taskName, setTaskName] = useState('');
    const [taskWeek, setTaskWeek] = useState('');
    const [taskYear, setTaskYear] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [formError, setFormError] = useState([]);

    const typeChanged = event => {
        setTaskType(event.target.value);
    }

    const nameChanged = event => {
        setTaskName(event.target.value);
    }

    const weekChanged = event => {
        setTaskWeek(event.target.value);
    }

    const yearChanged = event => {
        setTaskYear(event.target.value);
    }

    const dateChanged = event => {
        setTaskDate(event.target.value);
    }

    const validateAndPost = (event) => {
        event.preventDefault();

        const fieldErrors = [];
        if (emptyString(taskName)) {
            fieldErrors.push('nom de la tache non valide');
        }
        if (taskType === 'week') {
            if (!correctWeekYear(taskWeek, taskYear)) {
                fieldErrors.push('semaine ou année incorrecte');
            }
        }
        if (taskType === 'date' && !isDate(taskDate)) {
            fieldErrors.push('date incorrecte');
        }
        if (fieldErrors.length > 0) {
            setFormError(`Erreur sur le formulaire: ${fieldErrors.join(', ')}`)
        } else {
            setFormError('');
        }
        //TODO: post data and success message
    }

    return (
        <Form onSubmit={validateAndPost}>
            {formError.length > 0 &&
                <Alert variant="danger">{formError}</Alert>
            }
            <div key="inline-radios" className="m-4 text-start">
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
            <Form.Group className="m-4 col-lg-6 text-start" controlId="taskName">
                <Form.Label>Nom de la tâche</Form.Label>
                <Form.Control onChange={nameChanged}/>
            </Form.Group>
            {taskType === 'date' &&
                <Form.Group className="m-4 col-lg-6 text-start" controlId="taskDate">
                    <Form.Label>Date:</Form.Label>
                    <Form.Control
                        type="date"
                        onChange={dateChanged}/>
                </Form.Group>
            }
            {taskType === 'week' &&
                <Form.Group className="m-4 col-lg-6 text-start" controlId="taskWeek">
                    <Form.Label>Semaine:</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="numéro de la semaine (entre 1 et 53)"
                        onChange={weekChanged}/>
                <Form.Label>Année:</Form.Label>
                    <Form.Control
                        type="number"
                        onChange={yearChanged}/>
                </Form.Group>
            }
            <Button type="submit">
                Créer
            </Button>
        </Form>
    )
}

export default Task;