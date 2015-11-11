import React from 'react';
import Valya from 'valya';
import Foma from '../../../lib/index';

const { Component } = React;

@Valya
class Validator extends Component {
    static displayName = 'Validator';

    _renderError () {
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
    }
};

@Foma
export default class TestForm extends Component {
    static displayName = 'TestForm';

    constructor (props) {
        super(props);

        this.state = {
            username: null,
            password: null
        };
    }

    setUsername (e) {
        this.setState({username: e.target.value});
    }

    setPassword (e) {
        this.setState({password: e.target.value});
    }

    submitForm (event) {
        if (this.props.isValid) {
            this.setState({submitted: true});
        } else {
            this.props.foma.viewWarning(true);
        }

        return event.preventDefault();
    }

    render () {
        return (
            <form noValidate>
                <Validator
                    value={this.state.username}
                    name="username"
                    onEnd={(isValid, message) => {
                        this.props.testUsername(isValid, this.state.username);
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
                        ref="username"
                        name="username"
                        className="form-control"
                        value={this.state.username}
                        onChange={::this.setUsername} />
                </Validator>
                <Validator
                    value={this.state.password}
                    name="password"
                    onEnd={(isValid, message) => {
                        this.props.testPass(isValid, this.state.password);
                    }}
                    validators={[
                        {
                            validator (value, params) {
                                if (value === 123456) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(params.message);
                            },
                            params: {
                                message: 'Password must be 123456'
                            }
                        }
                    ]}
                    initialValidation={true}>
                    <input
                        type="text"
                        id="password"
                        ref="password"
                        name="password"
                        className="form-control"
                        value={this.state.password}
                        onChange={::this.setPassword} />
                </Validator>
                <div className="form-group" ref="fomaWarning">
                    {this.props.foma.renderWarning({
                        message: 'These fields are required:',
                        items: this.props.invalidFields.map(e => {
                            return {
                                fieldName: e,
                                name: requiredFields[e].name,
                                handler: requiredFields[e].handler
                            }
                        })
                    })}
                </div>
                <button
                    type="submit"
                    ref="submit"
                    disabled={this.props.isInvalid}
                    className="submit"
                    onClick={::this.submitForm}>
                    Submit
                </button>
            </form>
        );
    }
}
