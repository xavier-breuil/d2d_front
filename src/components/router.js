import {createBrowserRouter} from 'react-router-dom';
import moment from 'moment';

import Weekly from './weekly';
import Task from './task';
import MotList from './motlist';
import Label from './label';

const router = createBrowserRouter([
    {path: '/', element: <Weekly
        weekNum={moment().isoWeek()}
        currentYear={moment().year()}/>,},
    {path: '/task', element: <Task />,},
    {path: '/mot', element: <MotList />,},
    {path: '/label', element: <Label />,}
]);

export default router;