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