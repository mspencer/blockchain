import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import App from './components/App';
import Blocks from './components/Blocks';
import './index.css';


const root = createRoot(document.getElementById('root'));
root.render(
    <Router history={history}>
        <Switch>
            <Route path='/' component={App} />
            <Route path='/blocks' component={Blocks} />
        </Switch>
    </Router>
);