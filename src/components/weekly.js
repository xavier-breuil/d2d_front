import { useState, useEffect, useRef } from 'react';

import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import "bootstrap-icons/font/bootstrap-icons.css";

import {getWeekTask, deleteDatedTask, deleteWeekTask, markAsDoneTask,
    getLabels, updateTask} from '../api/backend_api';
import {acceptedDeleteStatus, weekDays, customButtonSizes} from '../utils/constants';
import {emptyString, getNextWeek, getPreviousWeek, correctWeekYear} from '../utils/functions';
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
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [allSelected, setAllSelected] = useState(false);
    const [weekdaysSelected, setWeekdaysSelected] = useState(weekDays.map(day => {return {...day, checked: false}}));
    const [showModal, setShowModal] = useState(false);
    const [modalId, setModalId] = useState();
    const [modalDate, setModalDate] = useState();
    const [modalYear, setModalYear] = useState();
    const [modalWeek, setModalWeek] = useState();
    const [modalNameError, setModalNameError] = useState(false);
    const [modalWeekYearError, setModalWeekYearError] = useState(false);
    const [modalTaskName, setModalTaskName] = useState();
    const [labels, setLabels] = useState([]);
    const [modifiedTaskLabels, setModifiedTaskLabels] = useState([]);
    const [modalType, setModalType] = useState('');

    const contentToPrintRef = useRef(null);
    const print = useReactToPrint({
        contentRef: contentToPrintRef,
        documentTitle: `week_${weekNumber}_planning`,
    })

    useEffect(() => {
        getWeekTask(weekNumber, year)
            .then(tasks => {
                const tempWeekTasks = tasks.weeklyTask;
                tempWeekTasks.forEach(task => {
                    task.checked = false;
                });
                setWeekTasks(tempWeekTasks);
                const tempDatedTasks = tasks.datedTask;
                // eslint-disable-next-line
                tempDatedTasks.forEach(task => {
                    task.dayOfWeek = moment(task.date).isoWeekday();
                    task.checked = false;
                });
                setDatedTasks(tempDatedTasks);
                const tempLateTasks = tasks.lateTask;
                tempLateTasks.forEach(task => {
                    task.checked = false;
                });
                setLateTasks(tempLateTasks);
            })
            .then(() => {
                return getLabels();
            })
            .then(labelList => {
                setLabels(labelList);
            })
            .catch(error => {
                console.log(error);
                displayAlert(true, 'danger', 'Erruer lors de la récupération des données');
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
                    setLateTasks(lateTasks.filter(task => !task.checked));
                    const weekdaysChecked = weekdaysSelected.map(day => {
                        return {...day, checked: false};
                    })
                    setWeekdaysSelected(weekdaysChecked);
                    displayAlert(true, 'success', 'Les tâches ont bien été supprimées');
                } else {
                    console.log(`error: deleting tasks [${[...datedToDelete, ...weekToDelete].map(task => task.id)}] returned unexpected status code: ${statusList}`);
                    displayAlert(true, 'danger', 'Erreur lors de la suppression des tâches');
                }
            })
            .catch(error => {
                displayAlert(true, 'danger', 'Erreur lors de la suppression des tâches');
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
        const weekdaysChecked = weekdaysSelected.map(day => {
            return {...day, checked: false};
        })
        setWeekdaysSelected(weekdaysChecked);
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
                    displayAlert(true, 'danger', 'Erreur lors de la modification des tâches');
                }
            })
            .catch(error => {
                displayAlert(true, 'danger', 'Erreur lors de la modification des tâches');
                console.log(error);
            })
    }

    const displayAlert = (show, type, message) => {
        setShowAlert(show);
        setAlertMessage(message);
        setAlertType(type);
        window.scrollTo(0,0);
    }

    const selectAll = () => {
        setAllSelected(!allSelected);
        const datedTaskChecked = datedTasks.map(task => {return {...task, checked: allSelected}});
        const lateTaskChecked = lateTasks.map(task => {return {...task, checked: allSelected}});
        const weekTaskChecked = weekTasks.map(task => {return {...task, checked: allSelected}});
        setDatedTasks(datedTaskChecked);
        setWeekTasks(weekTaskChecked);
        setLateTasks(lateTaskChecked);
    }

    const setDayChecked = (event, weekdayNumber) => {
        const newDaysChecked = weekdaysSelected.map(day => {
            if (day.weekdayNumber === weekdayNumber) {
                return {...day, checked: event.target.checked};
            }
            return day;
        });
        const newDatedTasks = datedTasks.map(task => {
            if (task.dayOfWeek === weekdayNumber) {
                return {...task, checked: event.target.checked};
            }
            return task;
        })
        setWeekdaysSelected(newDaysChecked);
        setDatedTasks(newDatedTasks);
    }

    const openDateModal = (taskName, taskDate, taskId, taskLabels) => {
        setModalType('date');
        setModalDate(taskDate);
        setModalTaskName(taskName);
        setModalId(taskId);
        setModifiedTaskLabels(taskLabels);
        setShowModal(true);
    }

    const openWeekModal = (taskName, taskYear, taskWeek, taskId, taskLabels) => {
        setModalType('week');
        setModalYear(taskYear);
        setModalWeek(taskWeek);
        setModalTaskName(taskName);
        setModalId(taskId);
        setModifiedTaskLabels(taskLabels);
        setShowModal(true);
    }

    const saveTask = () => {
        if (emptyString(modalTaskName)) {
            setModalNameError(true);
            return;
        }
        let taskData = {};
        if (modalType === 'date') {
            taskData = {
                name: modalTaskName,
                date: modalDate,
                label: modifiedTaskLabels.map(lab => {return {id: lab.id}})
            };
        } else {
            if (!correctWeekYear(modalWeek, modalYear)) {
                setModalWeekYearError(true);
                return;
            }
            taskData = {
                name: modalTaskName,
                year: modalYear,
                week_number: modalWeek,
                label: modifiedTaskLabels.map(lab => {return {id: lab.id}})
            }
        }
        updateTask(modalType, modalId, taskData)
            .then(response => {
                if (response.status === 200) {
                    handleCloseModal();
                    return response.data;
                } else {
                    console.log(response);
                    throw new Error (`unexpected response status ${response.status}`);
                }
            })
            .then (modTask => {
                modTask.checked = false;
                if (modalType === 'date') {
                    const tempDateTask = datedTasks.map(task => {
                        if (task.id !== modTask.id) {
                            return task;
                        } else {
                            modTask.dayOfWeek = moment(modTask.date).isoWeekday();
                            return modTask;
                        }
                    });
                    setDatedTasks(tempDateTask);
                } else  {
                    let tempWeekTask = [];
                    if (modTask.week_number !== weekNumber) {
                        tempWeekTask = weekTasks.filter(task => task.id !== modTask.id);
                    } else {
                        tempWeekTask = weekTasks.map(task => {
                            if (task.id !== modTask.id) {
                                return task;
                            } else {
                                return modTask;
                            }
                        });
                    }
                    setWeekTasks(tempWeekTask);
                }
            })
            .catch (error => {
                console.log(error);
                handleCloseModal();
                displayAlert(true, 'danger', 'Erreur lors de la modification de la tâche');
            })
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setModalId('');
        setModalDate('');
        setModalWeek('');
        setModalYear('');
        setModalTaskName('');
        setModalType('');
        setModifiedTaskLabels([]);
        setModalNameError(false);
        setModalWeekYearError(false);
    }

    const modalTaskNameChanged = event => {
        setModalTaskName(event.target.value);
        if (event.target.value.length > 0) {
            setModalNameError(false);
        }
    }

    const modalDateChanged = event => {
        setModalDate(event.target.value);
    }

    const modalYearChanged = event => {
        setModalYear(event.target.value);
    }

    const modalWeekChanged = event => {
        setModalWeek(event.target.value);
    }

    const addLabel = (_, label) => {
        const tempLabels = [];
        modifiedTaskLabels.forEach(lab => tempLabels.push(lab.id));
        const labelIndex = tempLabels.indexOf(label.id);
        if (labelIndex === -1) {
            tempLabels.push(label.id);
        } else {
            tempLabels.splice(labelIndex, 1);
        }
        setModifiedTaskLabels(labels.filter(lab => tempLabels.includes(lab.id)));
    }

    return (
        <Container fluid ref={contentToPrintRef} className="px-0">
            {showAlert &&
                <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            }
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>Modifier tâche</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nom de la tâche:</Form.Label>
                            <Form.Control className={modalNameError ? 'border-danger' : ''} onChange={modalTaskNameChanged} value={modalTaskName}/>
                        </Form.Group>
                        {modalType === 'date'&& <Form.Group>
                            <Form.Label>Date de la tâche:</Form.Label>
                            <Form.Control type="date" onChange={modalDateChanged} value={modalDate}/>
                        </Form.Group>}
                        {modalType === 'week' && <Form.Group>
                            <Form.Label>Année:</Form.Label>
                            <Form.Control
                                className={modalWeekYearError ? 'border-danger' : ''}
                                type="number"
                                onChange={modalYearChanged}
                                value={modalYear}/>
                        </Form.Group>}
                        {modalType === 'week' && <Form.Group>
                            <Form.Label>Semaine:</Form.Label>
                            <Form.Control
                                className={modalWeekYearError ? 'border-danger' : ''}
                                placeholder="entre 1 et 53"
                                type="number"
                                onChange={modalWeekChanged}
                                value={modalWeek}/>
                        </Form.Group>}
                        <Form.Group>
                            <Form.Label>
                                Etiquettes:
                            </Form.Label>
                            <Stack
                                direction="horizontal"
                                gap="1">
                                {labels.map(label => {
                                    return <Button
                                        key={'label-button-' + label.id}
                                        size="sm"
                                        variant={modifiedTaskLabels.map(lab => lab.id).includes(label.id) ? 'primary' : 'outline-primary'}
                                        onClick={event => addLabel(event, label)}>
                                        {label.name}
                                    </Button>
                            })}
                            </Stack>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={saveTask}>Enregistrer</Button>
                    <Button onClick={handleCloseModal}>Annuler</Button>
                </Modal.Footer>
            </Modal>
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
                    {weekdaysSelected.map(day => {
                        return <div key={day.weekdayNumber}>
                            <Row key={day.weekdayNumber} className="fw-bold mt-3 text-start">
                                <Form.Check
                                    type="checkbox"
                                    id={"check_" + day.weekdayNumber}
                                    label={day.name}
                                    onChange={event => setDayChecked(event, day.weekdayNumber)}
                                    checked={day.checked} />
                            </Row>
                            {datedTasks.filter(
                                t => t.dayOfWeek === day.weekdayNumber
                                ).map(
                                    t=> {
                                        return (
                                            <Row key={t.id}>
                                                <Stack
                                                    direction="horizontal"
                                                    gap={3}
                                                    className="my-2">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id={"check_" + t.id}
                                                        label={(t.done ? <del>{t.name}</del> : t.name)}
                                                        onChange={event => setDatedChecked(event, t.id)}
                                                        checked={t.checked} />
                                                    <Button
                                                        className="bi bi-pen py-0"
                                                        variant="outline-primary"
                                                        style={{fontSize: customButtonSizes.xs}}
                                                        onClick={event => openDateModal(t.name, t.date, t.id, t.label)}></Button>
                                                </Stack>
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
                                <Stack
                                    direction="horizontal"
                                    gap={3}
                                    className="my-2">
                                    <Form.Check
                                        type="checkbox"
                                        id={"check_week_" + wt.id}
                                        label={(wt.done ? <del>{wt.name}</del> : wt.name)}
                                        onChange={event => setWeekChecked(event, wt.id)}
                                        checked={wt.checked} />
                                    <Button
                                        className="bi bi-pen py-0"
                                        variant="outline-primary"
                                        style={{fontSize: customButtonSizes.xs}}
                                        onClick={event => openWeekModal(wt.name, wt.year, wt.week_number, wt.id, wt.label)}></Button>
                                </Stack>
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
                <Col sm={{span: 2, offset: 3}} className="text-end">
                    <Button variant="success" onClick={selectAll}>
                        tout sélectionner
                    </Button>
                </Col>
                <Col className="col-1 text-end">
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