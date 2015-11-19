import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Foma from '../../lib/index';
import assign from 'object-assign';
import { Validator } from './valya';
import { standardValidator, asyncValidator } from './validators';

const requiredFields = {
    username: {
        name: 'awesome username'
    },
    browser: {
        name: 'the best ever browser',
        handler: () => {
            alert('Please, select browser before!');
        }
    },
    async: {
        name: 'async username'
    }
};

const browsers = ['chrome', 'firefox', 'opera', 'safari'];

@Foma
class FormDemo extends Component {
    static displayName = 'FormDemo';

    constructor (props, context) {
        super(props, context);

        this.state = {
            async: null,
            username: null,
            browser: null
        };
    }

    submitForm (event) {
        if (this.props.isValid) {
            alert('You\'re awesome');
        } else {
            this.props.foma.viewWarning(true);
        }

        return event.preventDefault();
    }

    setUsername (e) {
        this.setState({username: e.target.value});
    }

    setBrowser (browser) {
        this.setState({browser: browser});
    }

    render () {
        return (
            <form name="formName" style={{width: '500px', padding: '50px 0 0 50px'}} noValidate>
                <div className="form-group">
                    <label htmlFor="username">Type your username</label>
                    <Validator
                        value={this.state.username}
                        name="username"
                        validators={[standardValidator]}
                        silentInitValidation={true}>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            value={this.state.username}
                            onChange={::this.setUsername} />
                    </Validator>
                </div>
                <div className="form-group">
                    <label htmlFor="async">Type your async name</label>
                    <Validator
                        value={this.state.async}
                        name="async"
                        validators={[asyncValidator]}
                        silentInitValidation={true}>
                        <input
                            type="text"
                            id="async"
                            name="async"
                            className="form-control"
                            value={this.state.async}
                            onChange={(event) => {
                                this.setState({async: event.target.value});
                            }} />
                    </Validator>
                </div>
                <div className="form-group">
                    <Validator
                        value={this.state.browser}
                        name="browser"
                        validators={[standardValidator]}
                        silentInitValidation={true}>
                        {browsers.map(browser => {
                            return (
                                <div
                                    className={browser + (this.state.browser === browser ? ' selected' : '')}
                                    onClick={this.setBrowser.bind(this, browser)}
                                    key={browser}>
                                    {browser}
                                </div>
                            );
                        })}
                    </Validator>
                </div>
                <div className="form-group">
                    {this.props.foma.renderWarning({
                        message: 'These fields are required:',
                        requiredFields: requiredFields
                    })}
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className={'btn btn-success' + (this.props.isInvalid ? ' btn-danger' : '')}
                        onClick={::this.submitForm}>
                        OK! Watch me magic!
                    </button>
                </div>
            </form>
        );
    }
}

render(<FormDemo />, document.querySelector('.main'));
