import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

import {getLabels} from '../api/backend_api';

const Label = () => {
    const [labels, setLabels] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    useEffect(() => {
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
    },
    [])

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

    const deleteLabel = (event, index) => {
        const newLabels = labels.map((label, ind) => {
            if (ind === index) {
                return {...label, show: false};
            } else {
                return label;
            }
        })
        setLabels(newLabels);
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
                        <Button variant="outline-danger" onClick={event => deleteLabel(event, index)}><i className="bi bi-trash" /></Button>
                        <Form.Group className="col-lg-4 text-start">
                            <Form.Control onChange={event => nameChanged(event, label, index)} value={label.name} />
                        </Form.Group>
                    </Stack>
                ))
            })}
            <Stack direction="horizontal" gap={4} className="ms-4 mt-4">
                    <Button onClick={addLabel}>Ajouter</Button>
                    <Button>Sauvegarder</Button>
            </Stack>
      </Container>
    )
}

export default Label;
