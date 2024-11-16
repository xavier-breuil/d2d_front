import { useState, useEffect } from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';

import {getMots} from '../api/backend_api';
import MotForm from './motform';
import {defaultMot} from '../utils/constants';

const MotList = () => {
    const [motList, setMotList] = useState([]);
    const [actMot, setMot] = useState(defaultMot);
    const [addedMot, setAddedMot] = useState(0);

    useEffect(() => {
        getMots()
            .then(mots => {
                setMotList(mots);
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

    // TODO: diferentiate scrolling in mot list from scrolling mot form.
    return (
        <Tab.Container>
            <Row>
                <Col sm={3}>
                    <ListGroup>
                        <Button className="mt-4 mb-4" onClick={addMot}>ajouter une récurrence</Button>
                        {motList.map(mot => {
                            return <ListGroup.Item
                                action
                                key={'item_' + mot.id}
                                onClick={() => setMot(mot)}>{mot.name}</ListGroup.Item>
                        })}
                    </ListGroup>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        <MotForm mot={actMot} parentMotNameChanged={nameChanged}/>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    )
}

export default MotList;