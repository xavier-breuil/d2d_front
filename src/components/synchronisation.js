import Button from 'react-bootstrap/Button';
import { getGoogleCalendarEvents } from '../api/google_api';

const Synchronisation = () => {

    const synchronize = event => {
        // TODO: get user calendarId elsewhere.
        getGoogleCalendarEvents(sessionStorage.getItem('googleAccessToken'), '2025-02-01T00:00:00Z', '2025-02-07T00:00:00Z', process.env.REACT_APP_GOOGLE_CALENDAR_ID)
            .then(resp => {
                console.log(resp);
            })
    }

    return <Button onClick={synchronize}>sync</Button>
}

export default Synchronisation;