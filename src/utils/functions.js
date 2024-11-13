import moment from 'moment';

export const getNextWeek = (weekNumber, year) => {
    const weekInYear = moment().set('year', year).isoWeeksInYear();
    if (weekNumber == weekInYear) {
        return {
            year: year + 1,
            weekNumber: 1
        }
    }
    return {
        year: year,
        weekNumber: weekNumber + 1
    }
}

export const getPreviousWeek = (weekNumber, year) => {
    if (weekNumber == 1) {
        return {
            year: year - 1,
            weekNumber: moment().set('year', year - 1).isoWeeksInYear()
        }
    }
    return {
        year: year,
        weekNumber: weekNumber - 1
    }
}

export const emptyString = str => {
    return !str.replace(/\s+/g, '');
}

const isWeek = str => {
    const num = Number(str);
    return (
        Number.isInteger(num) &&
        num >=1 &&
        num <=53)
}

const isYear = str => {
    const num = Number(str);
    return (
        Number.isInteger(num) &&
        num >=2024)

}

export const correctWeekYear = (weekStr, yearStr) => {
    if (!isWeek(weekStr) || !isYear(yearStr)) {
        return false;
    }
    const week = Number(weekStr);
    const year = Number(yearStr);
    return week <= moment().year(year).isoWeeksInYear();
}

export const isDate = dateStr => {
    return moment(dateStr, 'YYYY-MM-DD').isValid();
}
