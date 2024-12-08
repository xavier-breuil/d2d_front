import { useState, useEffect, useRef } from 'react';

import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import "bootstrap-icons/font/bootstrap-icons.css";

import {getWeekTask, deleteDatedTask, deleteWeekTask, markAsDoneTask} from '../api/backend_api';
import {acceptedDeleteStatus, weekDays} from '../utils/constants';
import {getNextWeek, getPreviousWeek} from '../utils/functions';
import { useReactToPrint } from 'react-to-print';

function Weekly({weekNum, currentYear}) {
    // define state
    const [weekTasks, setWeekTasks] = useState([]);
    const [datedTasks, setDatedTasks] = useState([]);
    const [lateTasks, setLateTasks] = useState([]);
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
                const tempWeekTasks = tasks.weeklyTask;
                tempWeekTasks.map(task => {
                    task.checked = false;
                });
                setWeekTasks(tempWeekTasks);
                const tempDatedTasks = tasks.datedTask;
                // eslint-disable-next-line
                tempDatedTasks.map(task => {
                    task.dayOfWeek = moment(task.date).isoWeekday();
                    task.checked = false;
                });
                setDatedTasks(tempDatedTasks);
                const tempLateTasks = tasks.lateTask;
                tempLateTasks.map(task => {
                    task.checked = false;
                });
                setLateTasks(tempLateTasks);
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

    const performDeleteTasks = _ => {
        const datedToDelete = [
            ...datedTasks.filter(t => t.checked),
            ...lateTasks.filter(t => t.checked && t.type === 'date')];
        const datedDeletePromises = datedToDelete.map(task => deleteDatedTask(task.id));
        const weekToDelete = [
            ...weekTasks.filter(t => t.checked),
            ...lateTasks.filter(t => t.checked && t.type === 'week')];
        const weekDeletePromises = weekToDelete.map(task => deleteWeekTask(task.id));
        Promise.all([...datedDeletePromises,...weekDeletePromises])
            .then(responses => {
                const statusList = responses.map(resp =>resp.status);
                if (statusList.every(status => acceptedDeleteStatus.includes(status))) {
                    setDatedTasks(datedTasks.filter(task => !task.checked));
                    setWeekTasks(weekTasks.filter(task => !task.checked));
                    setLateTasks(lateTasks.filter(task => !task.checked))
                } else {
                    console.log(`error: deleting tasks [${[...datedToDelete, ...weekToDelete].map(task => task.id)}] returned unexpected status code: ${statusList}`);
                    setShowErrorAlert(true);
                }
            })
            .catch(error => {
                setShowErrorAlert(true);
                console.log(error);
            })
    }

    const setDatedChecked = (event, id) => {
        // recommanded way by react: https://react.dev/learn/updating-arrays-in-state
        const newChecks = datedTasks.map(task => {
            if (task.id !== id ) {
                return task;
            }
            return {
                ...task,
                checked: !task.checked
            }
        });
        setDatedTasks(newChecks);
    }

    const setWeekChecked = (event, id) => {
        // recommanded way by react: https://react.dev/learn/updating-arrays-in-state
        const newChecks = weekTasks.map(task => {
            if (task.id !== id ) {
                return task;
            }
            return {
                ...task,
                checked: !task.checked
            }
        });
        setWeekTasks(newChecks);
    }

    const setLateChecked = (event, id, taskType) => {
        // recommanded way by react: https://react.dev/learn/updating-arrays-in-state
        const newChecks = lateTasks.map(task => {
            if (task.id !== id || task.type !== taskType) {
                return task;
            }
            return {
                ...task,
                checked: !task.checked
            }
        });
        setLateTasks(newChecks);
    }

    const updateDoneStatus = (taskDone) => {
        const weekDone = weekTasks.map(task => {
            if (!task.checked) {
                return task;
            }
            return {
                ...task,
                done: taskDone,
                checked: false
            }
        });
        setWeekTasks(weekDone);
        const datedDone = datedTasks.map(task => {
            if (!task.checked) {
                return task;
            }
            return {
                ...task,
                done: taskDone,
                checked: false
            }
        });
        setDatedTasks(datedDone);
        const lateDone = lateTasks.map(task => {
            if (!task.checked) {
                return task;
            }
            return {
                ...task,
                done: taskDone,
                checked: false
            }
        });
        setLateTasks(lateDone);
    }

    /**
     * Update checked task to status done on backend, then uncheck all boxes
     *
     * @param {*} done: true to mark task as done, false otherwise
     */
    const markAsDone = taskDone => {
        const datedDone = [
            ...datedTasks.filter(t => t.checked),
            ...lateTasks.filter( t => t.checked && t.type === 'date')];
        const datedDonePromises = datedDone.map(task => markAsDoneTask(task.id, taskDone, 'date'));
        const weekDone = [
            ...weekTasks.filter(t => t.checked),
            ...lateTasks.filter(t => t.checked && t.type === 'week')];
        const weekDonePromises = weekDone.map(task => markAsDoneTask(task.id, taskDone, 'week'));
        Promise.all([...datedDonePromises,...weekDonePromises])
            .then(responses => {
                const statusList = responses.map(resp =>resp.status);
                if (statusList.every(status => acceptedDeleteStatus.includes(status))) {
                    updateDoneStatus(taskDone);
                } else {
                    console.log(`error: marking tasks as done [${[...datedDone, ...weekDone].map(task => task.id)}] returned unexpected status code: ${statusList}`);
                    setShowErrorAlert(true);
                }
            })
            .catch(error => {
                setShowErrorAlert(true);
                console.log(error);
            })
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
                                                    label={(t.done ? <del>{t.name}</del> : t.name)}
                                                    onChange={event => setDatedChecked(event, t.id)}
                                                    checked={t.checked} />
                                                </Col>
                                            </Row>
                                        )
                                    }
                                )
                            }
                            {/* leave space for manual writting of other task */}
                            <Row style={{height: 70}}></Row>
                        </div>
                })}
                </Col>
                <Col>
                    {weekTasks.map(wt => {
                        return (
                            <Row key={wt.id}>
                                <Col className="text-start">
                                    <Form.Check
                                    type="checkbox"
                                    id={"check_week_" + wt.id}
                                    label={(wt.done ? <del>{wt.name}</del> : wt.name)}
                                    onChange={event => setWeekChecked(event, wt.id)}
                                    checked={wt.checked} />
                                </Col>
                            </Row>
                        )
                    })}
                    {/* Leave space to write manually other task for the week */}
                    <Row style={{height: 400}}></Row>
                    <Row className="fw-bold mt-3">
                        Retard
                    </Row>
                    {lateTasks.filter(lt => lt.type === 'date').map(lt => {
                        return (
                            <Row key={lt.id}>
                                <Col className="text-start">
                                    <Form.Check
                                    type="checkbox"
                                    id={"check_late_" + lt.id}
                                    label={(lt.done ? <del>{lt.name}  <span className="fw-lighter">{' (' + lt.date + ')'}</span></del> : <div>{lt.name} <span className="fw-lighter">{' (' + lt.date + ')'}</span></div>)}
                                    onChange={event => setLateChecked(event, lt.id, lt.type)}
                                    checked={lt.checked} />
                                </Col>
                            </Row>
                        )
                    })}
                    {lateTasks.filter(lt => lt.type === 'week').map(lt => {
                        return (
                            <Row key={lt.id}>
                                <Col className="text-start">
                                    <Form.Check
                                    type="checkbox"
                                    id={"check_late_" + lt.id}
                                    label={(lt.done ? <del>{lt.name}  <span className="fw-lighter">{' (' + lt.week + '/' + lt.year + ')'}</span></del> : <div>{lt.name} <span className="fw-lighter">{' (W ' + lt.week + '/' + lt.year + ')'}</span></div>)}
                                    onChange={event => setLateChecked(event, lt.id, lt.type)}
                                    checked={lt.checked} />
                                </Col>
                            </Row>
                        )
                    })}
                </Col>
            </Row>
            <Row className="mt-2">
                <Col sm={{span: 1, offset: 4}} className="text-end">
                    <Button variant="success" onClick={_ => markAsDone(true)}>
                        <i className="bi bi-check"/>
                    </Button>
                </Col>
                <Col className="col-1">
                    <Button variant="warning" onClick={_ => markAsDone(false)}>
                        <i className="bi bi-x"/>
                    </Button>
                </Col>
                <Col className="text-start">
                    <Button variant="danger" onClick={performDeleteTasks}>supprimer</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Weekly;