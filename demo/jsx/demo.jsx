import React from 'react';
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

@Foma
class FormDemo extends Component {
    static displayName = 'FormDemo';

    constructor (props, context) {
        super(props, context);

        this.state = {
            username: null,
            password: null
        };
    }

    submitForm () {
        if (this.props.isValid) {
            console.log('great');
        } else {
            console.log('fail');
        }
    }

    setUsername (e) {
        this.setState({usernameValue: e.target.value});
    }

    setPassword (e) {
        this.setState({passwordValue: e.target.value});
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
                    <label htmlFor="username">Введи свой username</label>
                    <Validator
                        value={this.state.usernameValue}
                        onEnd={(isValid, message) => {
                            this.props.setValidationInfo({
                                isValid: isValid,
                                message: message,
                                name: 'username'
                            });
                        }}
                        validators={[
                            {
                                validator (value, params) {
                                    if (value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(params.message);
                                },
                                params: {
                                    message: 'Field is required'
                                }
                            }
                        ]}
                        initialValidation={true}>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={this.state.usernameValue}
                            onChange={::this.setUsername} />
                    </Validator>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Введи свой password</label>
                    <Validator
                        value={this.state.passwordValue}
                        onEnd={(isValid, message) => {
                            this.props.setValidationInfo({
                                isValid: isValid,
                                message: message,
                                name: 'password'
                            });
                        }}
                        validators={[
                            {
                                validator (value, params) {
                                    if (value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(params.message);
                                },
                                params: {
                                    message: 'Field is required'
                                }
                            },
                            {
                                validator (value, params) {
                                    if (value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(params.message);
                                },
                                params: {
                                    message: 'Field is requireds'
                                }
                            }
                        ]}
                        initialValidation={true}>
                        <input
                            type="text"
                            id="password"
                            className="form-control"
                            value={this.state.passwordValue}
                            onChange={::this.setPassword} />
                    </Validator>
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-success"
                        disabled={!this.props.isValid}
                        onClick={::this.submitForm}>
                        Сохранить
                    </button>
                </div>
            </form>
        );
    }
}

React.render(<FormDemo />, document.querySelector('.main'));
