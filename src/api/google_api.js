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
