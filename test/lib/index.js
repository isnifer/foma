import '../utils/jsdom';
import test from 'tape';
import React from 'react';
import ReactDOM from 'react-dom';
import { render, TestUtils } from '../utils/render';
import Foma from '../../lib/index';
import TestForm from './components/TestForm';

const { Component, PropTypes } = React;

test('Should be inited', assert => {
    assert.true(typeof Foma === 'function', 'Foma inited');
    assert.end();
});

test('Test valid data', assert => {
    let props = {
        username: 'Foma',
        password: 123456,
        testPass: (isValid, value) => {
            assert.true(isValid, 'Button should be enabled, cause pass 1..6');

            assert.end();
        },
        testUsername: (isValid, value) => {
            assert.true(isValid, 'Username should be filled');
        }
    };

    const Component = TestUtils.renderIntoDocument(<TestForm {...props} />);
    const Instance = Component._reactInternalInstance._renderedComponent._instance;
    const { username, password, submit } = Instance.refs;

    TestUtils.Simulate.change(username, {target: {value: props.username}});
    TestUtils.Simulate.change(password, {target: {value: props.password}});
});

test('Test invalid data', assert => {
    var i = 0;
    let props = {
        username: 'Foma',
        password: 1234567,
        testPass: (isValid, value) => {
            if (isValid) {
                console.log('=========================================');
                assert.equal(i += 1, 3, 'step 3');
                assert.true(isValid, 'Button should be enabled, cause pass 1..6');
            } else {
                console.log('=========================================');
                assert.equal(i += 1, 2, 'step 2');
                assert.false(isValid, 'Button should be disabled, cause pass 1..7');
            }
        },
        testUsername: (isValid, value) => {
            assert.equal(i += 1, 1, 'step 1');
            assert.true(isValid, 'Username should be filled');
        }
    };

    const Component = TestUtils.renderIntoDocument(<TestForm {...props} />);
    const Instance = Component._reactInternalInstance._renderedComponent._instance;
    const { username, password } = Instance.refs;

    TestUtils.Simulate.change(username, {target: {value: props.username}});
    TestUtils.Simulate.change(password, {target: {value: props.password}});

    setTimeout(function () {
        assert.equal(Instance.props.invalidFields.length, 1, 'There is one invalid field');
        assert.equal(Instance.props.invalidFields[0], 'password', 'It should be password');

        setTimeout(function () {
            props.password = 123456;
            TestUtils.Simulate.change(password, {target: {value: props.password}});

            setTimeout(function () {
                assert.false(Instance.props.invalidFields.length, 'There are no invalid fields');

                assert.end();
            }, 100);
        }, 100);
    }, 100);
});
