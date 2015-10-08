import React from 'react';
import ReactDOM from 'react-dom';
import Valya from 'valya';
import Foma from '../../lib/index';

const { Component, PropTypes } = React;

@Valya
class Validator extends Component {
    static displayName = 'Validator';

    _renderError() {
        if (!this.props.enabled || this.props.isValid) {
            return null;
        }

        return (
            <span className="validator__error" key="error">
                {this.props.validationErrorMessage}
            </span>
        );
    }

    render () {
        return (
            <span className="validator">
                <span className="validator__target" key="target">
                    {this.props.children}
                </span>
                {this._renderError()}
            </span>
        );
    }
}

const requiredFields = {
    username: {
        name: 'awesome username'
    },
    password: {
        name: 'awesome password'
    },
    browser: {
        name: 'the best ever browser',
        handler: () => {
            alert('Please, select browser before!');
        }
    }
};

const standardValidator = {
    validator (value, params) {
        if (value) {
            return Promise.resolve();
        }

        return Promise.reject(params.message);
    },
    params: {
        message: 'Field is required'
    }
};

@Foma
class FormDemo extends Component {
    static displayName = 'FormDemo';

    constructor (props, context) {
        super(props, context);

        this.state = {
            username: null,
            password: null,
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

    setPassword (e) {
        this.setState({password: e.target.value});
    }

    setBrowser (browser) {
        this.setState({browser: browser});
    }

    render () {
        return (
            <form
                name="formName"
                style={{
                    width: '500px',
                    padding: '50px 0 0 50px'
                }}
                noValidate>
                <div className="form-group">
                    <label htmlFor="username">Type your username</label>
                    <Validator
                        value={this.state.username}
                        onEnd={(isValid, message) => {
                            this.props.foma.setValidationInfo({
                                isValid: isValid,
                                message: message,
                                name: 'username'
                            });
                        }}
                        validators={[standardValidator]}
                        initialValidation={true}>
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
                    <label htmlFor="password">Type your password</label>
                    <Validator
                        value={this.state.password}
                        onEnd={(isValid, message) => {
                            this.props.foma.setValidationInfo({
                                isValid: isValid,
                                message: message,
                                name: 'password'
                            });
                        }}
                        validators={[standardValidator]}
                        initialValidation={true}>
                        <input
                            type="text"
                            id="password"
                            name="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={::this.setPassword} />
                    </Validator>
                </div>
                <div className="form-group">
                    <Validator
                        value={this.state.browser}
                        onEnd={(isValid, message) => {
                            this.props.foma.setValidationInfo({
                                isValid: isValid,
                                message: message,
                                name: 'browser'
                            });
                        }}
                        validators={[standardValidator]}
                        initialValidation={true}>
                        {['chrome', 'firefox', 'opera', 'safari'].map((browser) => {
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
                        items: this.props.invalidFields.map(function (e) {
                            return {
                                fieldName: e,
                                name: requiredFields[e].name,
                                handler: requiredFields[e].handler
                            }
                        })
                    })}
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className={'btn btn-success' + (this.props.isInvalid ? ' disabled' : '')}
                        onClick={::this.submitForm}>
                        OK! Watch me magic!
                    </button>
                </div>
            </form>
        );
    }
}

ReactDOM.render(<FormDemo />, document.querySelector('.main'));
