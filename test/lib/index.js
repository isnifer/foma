import '../utils/jsdom';
import test from 'tape';
import React from 'react';
import { render, TestUtils } from '../utils/render';
import Foma from '../../lib/index';
import Valya from 'valya';

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
class TestForm extends Component {
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

    render () {
        return (
            <form noValidate>
                <Validator
                    value={this.state.username}
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
                        ref="username"
                        className="form-control"
                        value={this.state.username}
                        onChange={::this.setUsername} />
                </Validator>
                <Validator
                    value={this.state.password}
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
                        className="form-control"
                        value={this.state.password}
                        onChange={::this.setPassword} />
                </Validator>
                <button
                    type="submit"
                    ref="submit"
                    disabled={!this.props.isValid}
                    className="submit">
                    {!this.props.isValid ? 'nonSubmit' : 'Submit'}
                </button>
            </form>
        );
    }
}

test('Should be inited', assert => {
    assert.true(typeof Foma === 'function', 'Foma inited');
    // assert.equal(c.props.children.length, 5, 'Has 3 top-children');

    assert.end();
});

test('Test valid data', assert => {
    const DOMComponentOne = TestUtils.renderIntoDocument(
        <TestForm />
    );
    const renderedTestFormOne = DOMComponentOne._reactInternalInstance._renderedComponent._instance;

    let { username, password, submit } = renderedTestFormOne.refs;

    username = React.findDOMNode(username);
    password = React.findDOMNode(password);

    TestUtils.Simulate.change(username, {target: {value: 'Foma'}});
    TestUtils.Simulate.change(password, {target: {value: 123456}});

    assert.false(submit.props.disabled, 'Disabled status should be false');

    assert.end();
});

test('Test invalid data', assert => {
    const DOMComponent = TestUtils.renderIntoDocument(
        <TestForm />
    );
    const renderedTestForm = DOMComponent._reactInternalInstance._renderedComponent._instance;

    let { username, password, submit } = renderedTestForm.refs;

    username = React.findDOMNode(username);
    password = React.findDOMNode(password);

    TestUtils.Simulate.change(username, {target: {value: 'Foma'}});
    TestUtils.Simulate.change(password, {target: {value: 1234567}});

    setTimeout(function () {
        assert.true(submit.props.disabled, 'Disabled status should be true, cause password incorrect');
    }, 0);

    assert.end();
});
