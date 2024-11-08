import { useState, useEffect } from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import {getMots} from '../api/backend_api';
import MotForm from './motform';
import {defaultMot} from '../utils/constants';

const MotList = () => {
    const [motList, setMotList] = useState([]);
    const [actMot, setMot] = useState(defaultMot);

    useEffect(() => {
        getMots()
            .then(mots => {
                setMotList(mots);
            })
    },

    []
    )

    // TODO: Add new line at top to create a new mot.
    // TODO: diferentiate scrolling in mot list from scrolling mot form.
    return (
        <Tab.Container>
            <Row>
                <Col sm={3}>
                    <ListGroup>
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
                        <MotForm mot={actMot} />
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    )
}

export default MotList;