import {createBrowserRouter} from 'react-router-dom';
import moment from 'moment';

import Weekly from './weekly';
import Task from './task';
import Mot from './mot';

const router = createBrowserRouter([
    {path: '/', element: <Weekly
        weekNum={moment().isoWeek()}
        currentYear={moment().year()}/>,},
    {path: '/task', element: <Task />,},
    {path: '/mot', element: <Mot />,}
]);

export default router;