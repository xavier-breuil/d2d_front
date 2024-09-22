import { useState, useEffect } from 'react';

import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {getWeekTask} from '../api/backend_api';
import {weekDays} from '../utils/constants';
import {getNextWeek, getPreviousWeek} from '../utils/functions';
import ChangeWeekButton from './buttons/changeWeekButton'

function Weekly({weekNum, currentYear}) {
    // define state
    const [weekTasks, setWeekTasks] = useState([]);
    const [datedTasks, setDatedTasks] = useState([]);
    const [weekNumber, setWeekNumber] = useState(weekNum);
    const [year, setYear] = useState(currentYear);
    const nextWeek = getNextWeek(weekNumber, year);
    const previousWeek = getPreviousWeek(weekNumber, year);

    useEffect(() => {
        getWeekTask(weekNumber, year)
            .then(tasks => {
                setWeekTasks(tasks.weeklyTask);
                const datedTasks = tasks.datedTask;
                // eslint-disable-next-line
                datedTasks.map(task => {
                    task.dayOfWeek = moment(task.date).isoWeekday()
                })
                setDatedTasks(datedTasks);
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

    return (
        <Container>
            <Row>
                <ChangeWeekButton buttonText="semaine précédente" handleClick={goToPreviousWeek} />
                <Col className="fw-bold fs-5 col-8">semaine {weekNumber}</Col>
                <ChangeWeekButton buttonText="semaine suivante" handleClick={goToNextWeek} />
            </Row>
            <Row>
                <Col>
                    {weekDays.map(day => {
                        return <div key={day.weekdayNumber}>
                            <Row key={day.weekdayNumber} className="fw-bold mt-3">
                                {day.name}
                            </Row>
                            {datedTasks.filter(
                                t => t.dayOfWeek === day.weekdayNumber
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