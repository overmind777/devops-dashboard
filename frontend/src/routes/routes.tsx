import { createBrowserRouter, Navigate } from 'react-router-dom'
import LogsPage from '../pages/LogsPage'
import Monitoring from '../pages/Monitoring'
import TerminalPage from '../pages/TerminalPage'
import ContainersPage from '../pages/ContainersPage'
import Layout from '../components/Layout'


const routes = createBrowserRouter( [
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Navigate to="monitoring" replace /> },
            { index: true, path: 'monitoring', element: <Monitoring /> },
            { path: 'containers', element: <ContainersPage /> },
            { path: 'logs', element: <LogsPage /> },
            { path: 'settings', element: <TerminalPage /> },
        ],
    },

] )

export default routes