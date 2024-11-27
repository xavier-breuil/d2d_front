import { useState, useEffect, useRef } from 'react';

import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import "bootstrap-icons/font/bootstrap-icons.css";

import {getWeekTask, deleteDatedTask} from '../api/backend_api';
import {acceptedDeleteStatus, weekDays} from '../utils/constants';
import {getNextWeek, getPreviousWeek} from '../utils/functions';
import { useReactToPrint } from 'react-to-print';

function Weekly({weekNum, currentYear}) {
    // define state
    const [weekTasks, setWeekTasks] = useState([]);
    const [datedTasks, setDatedTasks] = useState([]);
    const [weekNumber, setWeekNumber] = useState(weekNum);
    const [year, setYear] = useState(currentYear);
    const nextWeek = getNextWeek(weekNumber, year);
    const previousWeek = getPreviousWeek(weekNumber, year);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const contentToPrintRef = useRef(null);
    const print = useReactToPrint({
        contentRef: contentToPrintRef,
        documentTitle: `week_${weekNumber}_planning`,
    })

    useEffect(() => {
        getWeekTask(weekNumber, year)
            .then(tasks => {
                setWeekTasks(tasks.weeklyTask);
                const datedTasks = tasks.datedTask;
                // eslint-disable-next-line
                datedTasks.map(task => {
                    task.dayOfWeek = moment(task.date).isoWeekday();
                    task.toDelete = false;
                })
                setDatedTasks(datedTasks);
            })
    },

        // useEffect on state changes
        [weekNumber, year]
    )

    const goToPreviousWeek = () => {
        setWeekNumber(previousWeek.weekNumber);
        setYear(previousWeek.year);
    }

    const goToNextWeek = () => {
        setWeekNumber(nextWeek.weekNumber);
        setYear(nextWeek.year);
    }

    const performDeleteDatedTasks = _ => {
        const toDelete = datedTasks.filter(t => t.toDelete);
        const deletePromises = toDelete.map(task => deleteDatedTask(task.id));
        Promise.all(deletePromises)
            .then(responses => {
                const statusList = responses.map(resp =>resp.status);
                if (statusList.every(status => acceptedDeleteStatus.includes(status))) {
                    setDatedTasks(datedTasks.filter(task => !task.toDelete));
                } else {
                    console.log(`error: deleting tasks [${toDelete.map(task => task.id)}] returned unexpected status code: ${statusList}`);
                    setShowErrorAlert(true);
                }
            })
            .catch(error => {
                setShowErrorAlert(true);
                console.log(error);
            })
    }

    const setToDelete = (event, id) => {
        // recommanded way by react: https://react.dev/learn/updating-arrays-in-state
        const newChecks = datedTasks.map(task => {
            if (task.id !== id ) {
                return task;
            }
            return {
                ...task,
                toDelete: !task.toDelete
            }
        });
        setDatedTasks(newChecks);
    }

    return (
        <Container fluid ref={contentToPrintRef}>
            {showErrorAlert &&
                <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>Erreur lors de la suppression des tâches</Alert>
            }
            <Row>
                <Col xs={{span: 1, offset: 4}}>
                    <Button onClick={goToPreviousWeek}>
                        <i className="bi bi-arrow-left" />
                    </Button>
                </Col>
                <Col className="fw-bold fs-5 col-2">Sem {weekNumber}</Col>
                <Col className="col-1">
                    <Button onClick={goToNextWeek}>
                        <i className="bi bi-arrow-right" />
                    </Button>
                </Col>
                <Col sm={{span: 1, offset: 3}} className="p-0 text-end">
                    <Button onClick={print} className="rounded-0">
                        <i className="bi bi-printer" />
                    </Button>
                </Col>
            </Row>
            <Row className="mx-5">
                <Col>
                    {weekDays.map(day => {
                        return <div key={day.weekdayNumber}>
                            <Row key={day.weekdayNumber} className="fw-bold mt-3">
                                {day.name}
                            </Row>
                            {datedTasks.filter(
                                t => t.dayOfWeek === day.weekdayNumber
                                ).map(
                                    t=> {
                                        return (
                                            <Row key={t.id}>
                                                <Col className="text-start">
                                                    <Form.Check
                                                    type="checkbox"
                                                    id={"check_" + t.id}
                                                    label={t.name}
                                                    onChange={event => setToDelete(event, t.id)}
                                                    checked={t.toDelete} />
                                                </Col>
                                            </Row>
                                        )
                                    }
                                )
                            }
                        </div>
                    })}
                    <Row>
                        <Col className="text-start">
                            <Button variant="danger" onClick={performDeleteDatedTasks}>supprimer</Button>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    {weekTasks.map(wt => {
                        return (
                            <div key={wt.id}>{wt.name}</div>
                        )
                    })}
                </Col>
            </Row>
        </Container>
    )
}

export default Weekly;