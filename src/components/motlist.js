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
    const [addButtonDisabled, setAddButtonDisabled] = useState(false);

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

    const scrollableColumn = {overflow: 'auto', maxHeight: '100%'};

    return (
        <Tab.Container>
            <Row style={{height: '100vh'}}>
                <Col sm={3} style={scrollableColumn}>
                    <ListGroup>
                        <Button
                        className="mt-4 mb-4"
                        onClick={addMot}
                        disabled={addButtonDisabled}>ajouter une récurrence</Button>
                        {motList.map(mot => {
                            return <ListGroup.Item
                                action
                                key={'item_' + mot.id}
                                onClick={() => setMot(mot)}>{mot.name}</ListGroup.Item>
                        })}
                    </ListGroup>
                </Col>
                <Col sm={9} style={scrollableColumn}>
                    <Tab.Content>
                        <MotForm
                        mot={actMot}
                        parentMotNameChanged={nameChanged}
                        setAddButtonDisabled={setAddButtonDisabled}/>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    )
}

export default MotList;