import { useState, useEffect } from 'react';

import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {getWeekTask} from '../api/backend_api';
import {weekDays} from '../const/constants';

function Weekly() {
    // define state
    const [weekTasks, setWeekTasks] = useState([]);
    const [datedTasks, setDatedTasks] = useState([]);

    useEffect(() => {
        getWeekTask(moment().isoWeek())
            .then(tasks => {
                setWeekTasks(tasks.weeklyTask);
                const datedTasks = tasks.datedTask;
                datedTasks.map(task => {
                    task.dayOfWeek = moment(task.date).isoWeekday()
                })
                setDatedTasks(datedTasks);
            })
    },

        // no dependancies
        []
    )
    return (
        <Container>
            <Row>
                <Col>semaine précédente</Col>
                <Col>semaine {moment().isoWeek()}</Col>
                <Col>semaine suivante</Col>
            </Row>
            <Row>
                <Col>
                    {weekDays.map(day => {
                        return <div key={day.weekdayNumber}>
                            <Row key={day.weekdayNumber} className="fw-bold mt-3">
                                {day.name}
                            </Row>
                            {datedTasks.filter(
                                t => t.dayOfWeek == day.weekdayNumber
                                ).map(
                                    t=> {
                                        return (
                                            <Row key={t.id} className="ps-3">
                                                {t.name}
                                            </Row>
                                        )
                                    }
                                )
                            }
                        </div>
                    })}
                </Col>
                <Col>
                    {weekTasks.map(wt => {
                        return (
                            <div key={wt.id}>{wt.name}</div>
                        )
                    })}
                </Col>
            </Row>
        </Container>
    )
}

export default Weekly;