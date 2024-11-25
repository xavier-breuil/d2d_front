export const weekDays = [
    {
        weekdayNumber: 1,
        name: 'lundi'
    },
    {
        weekdayNumber: 2,
        name: 'mardi'
    },
    {
        weekdayNumber: 3,
        name: 'mercredi'
    },
    {
        weekdayNumber: 4,
        name: 'jeudi'
    },
    {
        weekdayNumber: 5,
        name: 'vendredi'
    },
    {
        weekdayNumber: 6,
        name: 'samedi'
    },
    {
        weekdayNumber: 7,
        name: 'dimanche'
    }
]

export const defaultMot = {
    name: 'nouvelle récurrence',
    task_name: 'nouvelle tâche',
    start_date: new Date().toISOString().substring(0,10),
    end_date: new Date().toISOString().substring(0,10),
    number_a_day: '',
    number_a_week: '',
    every_week: [],
    every_month: [],
    every_last_day_of_month: false,
    every_year:[]
}

export const acceptedDeleteStatus = [200, 204];
