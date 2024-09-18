import {createBrowserRouter} from 'react-router-dom';

import Weekly from './weekly';
import Task from './task';

const router = createBrowserRouter([
    {path: '/', element: <Weekly />,},
    {path: '/task', element: <Task />,}
]);

export default router;