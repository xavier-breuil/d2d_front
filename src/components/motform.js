import { useState } from 'react';
import { useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import {weekDays} from '../utils/constants';
import {dictToString, emptyString, isDate} from '../utils/functions';

const MotForm = ({mot}) => {
    const [motName, setMotName] = useState(mot.name);
    const [taskName, setTaskName] = useState(mot.task_name);
    const [startDate, setStartDate] = useState(mot.start_date);
    const [endDate, setEndDate] = useState(mot.end_date);
    const [numberADay, setNumberADay] = useState(mot.number_a_day);
    const [numberAWeek, setNumberAWeek] = useState(mot.number_a_week);
    const [everyWeek, setEveryWeek] = useState(mot.every_week);
    const [everyMonth, setEveryMonth] = useState(mot.every_month);
    const [lastDayOfMonth, setEveryLastDayOfMonth] = useState(mot.every_last_day_of_month);
    const [everyYear, setEveryYear] = useState(mot.every_year);
    // id 0f 0 indicates creation when save, otherwise, update.
    const [motId, setMotId] = useState(mot.id || 0);
    const [formError, setFormError] = useState([]);

    useEffect(() => {
        setMotName(mot.name);
        setTaskName(mot.task_name);
        setStartDate(mot.start_date);
        setEndDate(mot.end_date);
        setNumberADay(mot.number_a_day || '');
        setNumberAWeek(mot.number_a_week || '');
        setEveryWeek(mot.every_week);
        setEveryMonth(mot.every_month);
        setEveryLastDayOfMonth(mot.every_last_day_of_month);
        setEveryYear(mot.every_year);
        setMotId(mot.id || 0);
    },
    [mot])

    const motNameChanged = event => {
        setMotName(event.target.value);
    }

    const taskNameChanged = event => {
        setTaskName(event.target.value);
    }

    const startDateChanged = event => {
        setStartDate(event.target.value);
    }

    const endDateChanged = event => {
        setEndDate(event.target.value);
    }

    const numberADayChanged = event => {
        setNumberADay(event.target.value);
    }

    const numberAWeekChanged = event => {
        setNumberAWeek(event.target.value);
    }

    const everyWeekChanged = (event, weekdayNumber) => {
        if (event.target.checked) {
            // Use set to prevent from duplicate.
            setEveryWeek([...new Set([...everyWeek, weekdayNumber])]);
        } else {
            setEveryWeek(everyWeek.filter(weekDay => weekDay !== weekdayNumber));
        }
    }

    const everyMonthChanged = (event, monthDay) => {
        if (event.target.checked) {
            // Use set to prevent from duplicate.
            setEveryMonth([...new Set([...everyMonth, monthDay])]);
        } else {
            setEveryMonth(everyMonth.filter(monthdayNumber => monthDay !== monthdayNumber));
        }
    }

    const everyLastDayOfMonthChanged = event => {
        setEveryLastDayOfMonth(event.target.checked);
    }

        /**
         * Replace date in everyYear array after a chang in date input.
         * 
         * @param {*} event: event from the date input 
         * @param {*} index : index of the date changed in everyYeart array
         */
    const everyYearChanged = (event, index) => {
        // recommanded way by react: https://react.dev/learn/updating-arrays-in-state
        const newDates = everyYear.map((date, i) => {
            if (i !== index ) {
                return date;
            }
            return {
                year: event.target.value.substring(0,4),
                month: event.target.value.substring(5,7),
                day: event.target.value.substring(8,10)
            }
        });
        setEveryYear(newDates);
    }

    /**
     * Return true if the day number passed in param appears in everyWeek.
     * Initially used to fill the form to modify a mot.
     * 
     * @param {int} dayNumber: 1 for monday, 7 for sunday
     */
    const dayChecked = dayNumber => {
        return everyWeek.includes(dayNumber);
    }


    /**
     * Return true if the day number passed in param appears in everyMonth.
     * Initially used to fill the form to modify a mot.
     * 
     * @param {int} dayNumber: from 1 to max number of day in month range concerned
     * by start and end date
     */
    const monthdayChecked = dayNumber => {
        return everyMonth.includes(dayNumber);
    }

    const deleteDate = index => {
        setEveryYear(everyYear.filter((_, i) => i !== index))
    }

    const addDay = () => {
        const newDate = new Date();
        const year = newDate.toISOString().substring(0, 4);
        const month = newDate.toISOString().substring(5, 7);
        const day = newDate.toISOString().substring(8,10);
        setEveryYear([...everyYear, {
            year: year,
            month: month,
            day: day}])
    }

    const validateAndPost = event => {
        event.preventDefault();

        const fieldErrors = [];
        if (emptyString(motName)) {
            fieldErrors.push('nom de la récurrence nécessaire');
        }
        if (emptyString(taskName)) {
            fieldErrors.push('nom des tâches nécessaire');
        }
        if (!isDate(startDate)) {
            fieldErrors.push('la date de début est mal définie');
        }
        if (!isDate(endDate)) {
            fieldErrors.push('la date de fin est mal définie');
        }
        if (Date.parse(endDate) < Date.parse(startDate)) {
            fieldErrors.push('la date de fin doit être supérieur à la date de début');
        }
        let filledFields = 0;
        [numberADay, numberAWeek,everyWeek, everyMonth, everyYear].forEach(field => {
            if (field.length > 0) {
                filledFields++;
            }
        })
        if (lastDayOfMonth) {
            filledFields++;
        }
        if (filledFields != 1) {
            fieldErrors.push('exactement un des champs * doit être informé');
        }
        if (fieldErrors.length > 0) {
            setFormError(`Erreur sur le formulaire: ${fieldErrors.join(', ')}`)
            return;
        } else {
            setFormError('');
        }
        if (motId > 0) {
            updateMot();
        } else {
            createMot();
        }
    }

    const updateMot = () => {
        // TODO: Post data and display alert success
    }

    const createMot = () => {
        // TODO: Post data and display alert success
    }

    return (
        <Form onSubmit={validateAndPost}>
            {formError.length > 0 &&
                <Alert variant="danger" onClose={() => setFormError('')} dismissible>{formError}</Alert>
            }
            <Form.Group className="m-4 col-lg-6 text-start" controlId="motName">
                <Form.Label>Nom de la récurrence</Form.Label>
                <Form.Control onChange={motNameChanged} value={motName}/>
            </Form.Group>
            <Form.Group className="m-4 col-lg-6 text-start" controlId="motTaskName">
                <Form.Label>Nom des tâches</Form.Label>
                <Form.Control onChange={taskNameChanged} value={taskName} />
            </Form.Group>
            <Form.Group className="m-4 col-lg-6 text-start" controlId="motStartDate">
                <Form.Label>date de début</Form.Label>
                <Form.Control type="date" onChange={startDateChanged} value={startDate} />
            </Form.Group>
            <Form.Group className="m-4 col-lg-6 text-start" controlId="motEndDate">
                <Form.Label>date de fin</Form.Label>
                <Form.Control type="date" onChange={endDateChanged} value={endDate} />
            </Form.Group>
            <Form.Group className="m-4 col-lg-6 text-start" controlId="motNumberADay">
                <Form.Label>récurrence quotidienne*</Form.Label>
                <Form.Control type="number" onChange={numberADayChanged} value={numberADay} />
            </Form.Group>
            <Form.Group className="m-4 col-lg-6 text-start" controlId="motNumberAWeek">
                <Form.Label>récurrence hebdomadaire*</Form.Label>
                <Form.Control type="number" onChange={numberAWeekChanged} value={numberAWeek} />
            </Form.Group>
            <Form.Group className="m-4 col-lg-6 text-start" controlId="motEveryWeek">
                <Form.Label>jours de la semaine*</Form.Label>
                {weekDays.map(weekDay => {
                    return <Form.Check
                        key={`day_${weekDay.weekdayNumber}`}
                        onChange={event => everyWeekChanged(event, weekDay.weekdayNumber)}
                        type="checkbox"
                        label={weekDay.name}
                        checked={dayChecked(weekDay.weekdayNumber)} />
                })}
            </Form.Group>
            <Form.Group className="m-4 col-lg-6 text-start" controlId="motEveryMonth">
                <Form.Label>jours du mois*</Form.Label>
                <Row>
                    <Col>
                        {Array.from({length:7}, (_,i) => i+1).map(monthDay => {
                        return <Form.Check
                            key={`monthday_${monthDay}`}
                            onChange={event => everyMonthChanged(event, monthDay)}
                            type="checkbox"
                            label={monthDay}
                            checked={monthdayChecked(monthDay)} />
                        })}
                    </Col>
                    <Col>
                        {Array.from({length:7}, (_,i) => i+8).map(monthDay => {
                        return <Form.Check
                            key={`monthday_${monthDay}`}
                            onChange={event => everyMonthChanged(event, monthDay)}
                            type="checkbox"
                            label={monthDay}
                            checked={monthdayChecked(monthDay)} />
                        })}
                    </Col>
                    <Col>
                        {Array.from({length:7}, (_,i) => i+15).map(monthDay => {
                        return <Form.Check
                            key={`monthday_${monthDay}`}
                            onChange={event => everyMonthChanged(event, monthDay)}
                            type="checkbox"
                            label={monthDay}
                            checked={monthdayChecked(monthDay)} />
                        })}
                    </Col>
                    <Col>
                        {Array.from({length:7}, (_,i) => i+22).map(monthDay => {
                        return <Form.Check
                            key={`monthday_${monthDay}`}
                            onChange={event => everyMonthChanged(event, monthDay)}
                            type="checkbox"
                            label={monthDay}
                            checked={monthdayChecked(monthDay)} />
                        })}
                    </Col>
                    <Col>
                        {Array.from({length:3}, (_,i) => i+29).map(monthDay => {
                        return <Form.Check
                            key={`monthday_${monthDay}`}
                            onChange={event => everyMonthChanged(event, monthDay)}
                            type="checkbox"
                            label={monthDay}
                            checked={monthdayChecked(monthDay)} />
                        })}
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="m-4 col-lg-6 text-start" controlId="motLastDayOfMonth">
                <Form.Label>tous les derniers jours du mois*</Form.Label>
                <Form.Check type="checkbox" onChange={everyLastDayOfMonthChanged} checked={lastDayOfMonth} />
            </Form.Group>
            <Form.Group className="m-4 col-lg-6 text-start" controlId="everyYear">
                <Form.Label>jours de l'année*</Form.Label>
                {everyYear.map((date, index) => {
                    return <Row className="mt-4 mb-4" key={'every_year_row_' + index}>
                                <Col>
                                    <Form.Control
                                    type="date"
                                    key={'every_year_delete_' + date}
                                    onChange={event => everyYearChanged(event, index)}
                                    value={dictToString(date)} />
                                </Col>
                                <Col>
                                    <Button
                                        key={'every_year_delete_' + index}
                                        onClick={_ => deleteDate(index)}>supprimer
                                    </Button>
                                </Col>
                            </Row>
                })}
                <Row className="mt-4 mb-4">
                    <Col>
                        <Button onClick={addDay}>ajouter un jour</Button>                   
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="text-start" controlId="submit">
                <Form.Label>
                    <Button type="submit">Enregistrer</Button>
                </Form.Label>
            </Form.Group>
            <Form.Group className="text-start" controlId="explanation">
                <Form.Label>*there must be only one of these fields</Form.Label>
            </Form.Group>
        </Form>
    )
}

export default MotForm;