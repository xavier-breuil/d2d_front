import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const YearlessDatePicker = ({date, parentMonthChanged, parentDayChanged, deleteDate, index}) => {
    const [month, setMonth] = useState(date.month);

    const dateCombinations = [
        {month: 1, days:31},
        {month: 2, days:28},
        {month: 3, days:31},
        {month: 4, days:30},
        {month: 5, days:31},
        {month: 6, days:30},
        {month: 7, days:31},
        {month: 8, days:31},
        {month: 9, days:30},
        {month: 10, days:31},
        {month: 11, days:30},
        {month: 12, days:31}
    ];

    const monthChanged = event => {
        setMonth(event.target.value);
        parentMonthChanged(event.target.value);
    }

    const numberOfDays = m => {
        return dateCombinations.find(combi => combi.month === Number(m)).days;
    }

    return (
        <Form.Group key={'yearless_group_' + index} className="m-4 col-lg-6 text-start">
            <Row>
                <Col>
                    <Form.Label key={'yearless_month_' + index}>Mois</Form.Label>
                </Col>
                <Col>
                    <Form.Select
                        key={'yearless_month_select_' + index}
                        type="select"
                        onChange={monthChanged}
                        value={date.month}>
                        {Object.entries(dateCombinations).map(([m, d]) => (
                            <option key={'month_' + d.month} value={d.month}>{d.month}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Label key={'yearless_month_' + index}>Jour</Form.Label>
                </Col>
                <Col>
                    <Form.Select
                        key={'yearless_day_select_' + index}
                        type="select"
                        onChange={event => parentDayChanged(event.target.value, index)}
                        value={date.day}>
                        {[...Array(numberOfDays(month)).keys()].map(dayNumber => (
                            <option key={'day_' + dayNumber} value={dayNumber + 1}>{dayNumber + 1}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col>
                    <Button
                        key={'every_year_delete_' + index}
                        onClick={deleteDate}>supprimer
                    </Button>
                </Col>
            </Row>
        </Form.Group>
    )
}

export default YearlessDatePicker;