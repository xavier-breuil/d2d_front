import {createBrowserRouter} from 'react-router-dom';
import moment from 'moment';

import Weekly from './weekly';
import Task from './task';

const router = createBrowserRouter([
    {path: '/', element: <Weekly
        weekNum={moment().isoWeek()}
        currentYear={moment().year()}/>,},
    {path: '/task', element: <Task />,}
]);

export default router;