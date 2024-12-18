import { useState, useEffect } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

import {getLabels} from '../api/backend_api';

const Label = () => {
    const [labels, setLabels] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    useEffect(() => {
        getLabels()
            .then(setLabels)
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

    return (
        <Container fluid className="px-0">
            {showAlert &&
                <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>
            }
            {labels.map(label => {
                return (
                    <Row key={'label-row-' + label.id}>
                        <Col>{label.name}</Col>
                    </Row>
                )
            })}
      </Container>
    )
}

export default Label;
