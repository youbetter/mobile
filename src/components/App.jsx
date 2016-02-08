import React from 'react';
import { init, login, api } from '../utils/facebook';
import PouchDB from 'pouchdb';

init({ appId: __FACEBOOK_APP_ID__ });

var db = new PouchDB('you-better');



export default React.createClass({
    componentWillMount: function () {
        db
        .get('user')
        .then(user => {
            this.syncData(user.url);
        })
        .catch(error => {
            this.setState({
                ready: true,
                loggedIn: false
            })
        });
    },
    getInitialState: function () {
        return {
            ready: false,
            loggedIn: false
        };
    },
    render: function () {
        return (
            <div id="app">
                <header className="bar bar-nav">
                    <h1 className="title">YOU BETTER</h1>
                    {
                        this.state.loggedIn ?
                        '' :
                        <button className="btn btn-primary pull-right" onClick={this.onLoginClick}>Continue with Facebook</button>
                    }
                </header>
                <div className="content">
                    <p className="content-padded">
                        Let it shine.
                    </p>
                </div>
            </div>
        );
    },
    // TODO Handle errors
    onLoginClick: function () {
        // Login and authenticate at Facebook
        login(
            loginRes => {
                if (loginRes.status === 'connected') {
                    // Get user id from Graph API
                    api({
                        path: '/me',
                        success: apiRes => {
                            var xhr = new XMLHttpRequest();

                            xhr.onreadystatechange = () => {
                                var url;

                                if (xhr.readyState === 4 && xhr.status === 200) {
                                    url = JSON.parse(xhr.responseText).url;

                                    db.put({
                                        _id: 'user',
                                        url: url
                                    });

                                    this.syncData(url);
                                }
                            };

                            xhr.open(
                                'GET',
                                `${__YOUBETTER_API__}/database?user=${apiRes.id}&token=${loginRes.authResponse.accessToken}`,
                                true
                            );

                            xhr.send();
                        }
                    });
                }
            },
            { scope: 'email' }
        );
    },
    syncData: function (url) {
        db.sync(url, { live: true, retry: true });

        this.setState({ ready: true, loggedIn: true });
    }
});
