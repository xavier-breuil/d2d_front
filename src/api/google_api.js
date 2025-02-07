import axios from 'axios';

const googleBaseUrl = 'https://www.googleapis.com/';

export const getGoogleUserData = accessToken => {
    return axios.get(
        `${googleBaseUrl}oauth2/v1/userinfo?access_token=${accessToken}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json'
            }
        });
};

export const getGoogleCalendarEvents = (accessToken, minTime, maxTime, calendarId) => {
    return axios.get(
        `${googleBaseUrl}calendar/v3/calendars/${calendarId}/events?timeMin=${minTime}&timeMax=${maxTime}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json'
            }
        });
};
