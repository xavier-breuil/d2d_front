import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

import {getLabels, patchLabel, createLabel, deleteLabel} from '../api/backend_api';

const Label = () => {
    const [labels, setLabels] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    useEffect(() => {
        initLabels();
    },
    // eslint-disable-next-line
    [])

    const initLabels = () => {
        getLabels()
            .then(labelList => {
                labelList.forEach((label, index) => {
                    labelList[index] = {...label, show: true}
                });
                setLabels(labelList);
            })
            .catch(error => {
                console.log(error);
                displayAlert(true, 'danger', 'Erreur de récupération des étiquettes');
            })
    }

    const displayAlert = (show, type, alertMessage) => {
        setShowAlert(show);
        setAlertMessage(alertMessage);
        setAlertType(type);
        window.scrollTo(0,0);
    }

    const nameChanged = (event, label, index) => {
        const newLabels = labels.map((lab, ind) => {
            if (ind === index) {
                return {name: event.target.value, id: label.id, show: label.show};
            } else {
                return lab;
            }
        })
        setLabels(newLabels);
    }

    const addLabel = event => {
        const newLabels = labels.map(lab => lab);
        newLabels.push({name: '', show: true});
        setLabels(newLabels);
    }

    const hideLabel = (event, index) => {
        const newLabels = labels.map((label, ind) => {
            if (ind === index) {
                return {...label, show: false};
            } else {
                return label;
            }
        })
        setLabels(newLabels);
    }

    const saveLabels = event => {
        // TODO: validate form before
        const toCreate = labels.filter(label => {
            return label.id === undefined && label.show;
        });
        const toModify = labels.filter(label => {
            return label.id && label.show;
        });
        const toDelete = labels.filter(label => {
            return label.id && !label.show;
        })
        const labelPromises = [];
        toCreate.forEach(label => {
            labelPromises.push(createLabel(label));
        });
        toModify.forEach(label => {
            labelPromises.push(patchLabel(label));
        })
        toDelete.forEach(label => {
            labelPromises.push(deleteLabel(label));
        })
        Promise.all(labelPromises).then(
            responses => {
                if (responses.every(resp => [200, 201, 204].includes(resp.status))) {
                    // set id for created labels, remove deleted labels
                    initLabels()
                    displayAlert(true, 'success', 'Les étiquettes ont bien été modifiées');
                } else {
                    displayAlert(true, 'danger', `Erreur lors de la modification des étiquettes`);
                }
            }
        ).catch(error => {
            console.log(error);
            displayAlert(true, 'danger', `Erreur lors de la modification des étiquettes`);
        });
    }

    return (
        <Container fluid className="px-0">
            {showAlert &&
                <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>
            }
            {labels.map((label, index) => {
                return (
                    (label.show && <Stack direction="horizontal"
                        key={'label-row-' + index}
                        className="ms-4 mt-4"
                        gap={3}>
                        <Button variant="outline-danger" onClick={event => hideLabel(event, index)}><i className="bi bi-trash" /></Button>
                        <Form.Group className="col-lg-4 text-start">
                            <Form.Control onChange={event => nameChanged(event, label, index)} value={label.name} />
                        </Form.Group>
                    </Stack>
                ))
            })}
            <Stack direction="horizontal" gap={4} className="ms-4 mt-4">
                    <Button onClick={addLabel}>Ajouter</Button>
                    <Button onClick={saveLabels}>Sauvegarder</Button>
            </Stack>
      </Container>
    )
}

export default Label;
