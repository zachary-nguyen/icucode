import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core";

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
   , document.getElementById('root'));
