import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import './styles/base.scss';

const rootEl = document.createElement('div');

document.body.appendChild(rootEl);

function startApp () {
    ReactDOM.render(<App />, rootEl);
}

if (!window.cordova) {
    startApp();
} else {
    document.addEventListener('deviceready', startApp, false);
}
