import { useState, useEffect } from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Alert from 'react-bootstrap/Alert';
import "bootstrap-icons/font/bootstrap-icons.css";

import {getMots, deleteMot} from '../api/backend_api';
import MotForm from './motform';
import {defaultMot, acceptedDeleteStatus, colors} from '../utils/constants';

const MotList = () => {
    const [motList, setMotList] = useState([]);
    const [actMot, setMot] = useState(defaultMot);
    const [addedMot, setAddedMot] = useState(0);
    const [addButtonDisabled, setAddButtonDisabled] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    useEffect(() => {
        getMots()
            .then(mots => {
                setMotList(mots);
                return mots[0];
            })
            .then(mot => {
                if (mot) {
                    setMot(mot);
                } else {
                    setMot(defaultMot);
                    setAddButtonDisabled(false);
                }
            })
    },

    []
    )

    const addMot = () => {
        const newMot = {...defaultMot};
        newMot.id = `new_mot_${addedMot}`;
        setMotList([...motList, newMot])
        setAddedMot(addedMot + 1);
        setMot(newMot);
        setAddButtonDisabled(true);
    }

    const nameChanged = newName => {
        const newNames = motList.map(mot => {
            if (mot.id !== actMot.id) {
                return mot;
            }
            return {
                ...mot,
                name: newName
            }
        });
        setMotList(newNames);
    }

    const performDeleteMot = motId => {
        deleteMot(motId)
            .then(resp => {
                if (acceptedDeleteStatus.includes(resp.status)) {
                    setMotList(motList.filter(mot => mot.id !== motId));
                } else {
                    console.log(`error in status code deleteing mot ${motId}`);
                    displayAlert(true, 'danger', 'Erreur lors de la suppression de la récurrence');
                }
            })
            .catch(error => {
                displayAlert(true, 'danger', 'Erreur lors de la suppression de la récurrence');
                console.log(error);
            })
    }

    const displayAlert = (show, type, alertMessage) => {
        setShowAlert(show);
        setAlertMessage(alertMessage);
        setAlertType(type);
        window.scrollTo(0,0);
    }

    const scrollableColumn = {overflow: 'auto', maxHeight: '100%'};

    return (
        <Tab.Container>
            <Row style={{height: '100vh'}}>
                {showAlert &&
                    <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>
                }
                <Col sm={4} style={scrollableColumn}>
                    <ListGroup>
                        <Button
                        className="mt-4 mb-4"
                        onClick={addMot}
                        disabled={addButtonDisabled}>ajouter une récurrence</Button>
                        {motList.map(mot => {
                            return (
                                    <ListGroup.Item
                                        key={'item_' + mot.id}
                                        style={mot.done_tasks_count === mot.related_tasks_count ? {background: colors.lightGreen} : {}}>
                                        <Stack direction="horizontal">
                                            <Button variant="link" onClick={() => setMot(mot)}>
                                                {mot.name} ({mot.done_tasks_count}/{mot.related_tasks_count})
                                            </Button >
                                            <div className="ms-auto">
                                                <Button variant="outline-danger" onClick={_ => performDeleteMot(mot.id)}><i className="bi bi-trash" /></Button>
                                            </div>
                                        </Stack>
                                    </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </Col>
                <Col sm={8} style={scrollableColumn}>
                    <Tab.Content>
                        <MotForm
                        mot={actMot}
                        parentMotNameChanged={nameChanged}
                        setAddButtonDisabled={setAddButtonDisabled}
                        displayAlert={displayAlert}
                        />
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    )
}

export default MotList;