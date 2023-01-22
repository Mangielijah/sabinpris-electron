import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Home from '../views/home';

const history = createBrowserHistory();

const Routes = (
    <Router history={history}>
        <div>
            <Route path="/" exact component={Home} />
        </div>
    </Router>
);

export default Routes;
