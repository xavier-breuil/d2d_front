import { useState, useEffect } from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import {getMots} from '../api/backend_api'

const Mot = () => {
    const [motList, setMotList] = useState([]);
    const [actMotId, setMotId] = useState('');

    useEffect(() => {
        getMots()
            .then(mots => {
                setMotList(mots);
            })
    },

    []
    )

    return (
        <Tab.Container>
            <Row>
                <Col sm={3}>
                    <ListGroup>
                        {motList.map(mot => {
                            return <ListGroup.Item
                                action
                                key={'item_' + mot.id}
                                onClick={() => setMotId(mot.id)}>{mot.name}</ListGroup.Item>
                        })}
                    </ListGroup>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        {actMotId}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    )
}

export default Mot;