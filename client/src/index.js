import React from 'react';
import { createRoot } from 'react-dom/client';
import history from 'history';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import './index.css';

const router = createBrowserRouter([
    {
        path:"/",
        element: <App />
    },
    {
        path:"/blocks",
        element: <Blocks />
    },
    {
        path:"/conduct-transaction",
        element: <ConductTransaction />
    },
    {
        path:"/transaction-pool",
        element: <TransactionPool />
    }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
);