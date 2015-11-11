import 'babel/register';
import '../utils/jsdom';
import test from 'ava';
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
                assert.is(i += 1, 3, 'step 3');
                assert.true(isValid, 'Button should be enabled, cause pass 1..6');
            } else {
                assert.is(i += 1, 2, 'step 2');
                assert.false(isValid, 'Button should be disabled, cause pass 1..7');
            }
        },
        testUsername: (isValid, value) => {
            assert.is(i += 1, 1, 'step 1');
            assert.true(isValid, 'Username should be filled');
        }
    };

    const Component = TestUtils.renderIntoDocument(<TestForm {...props} />);
    const Instance = Component._reactInternalInstance._renderedComponent._instance;
    const { username, password } = Instance.refs;

    TestUtils.Simulate.change(username, {target: {value: props.username}});
    TestUtils.Simulate.change(password, {target: {value: props.password}});

    setTimeout(() => {
        assert.is(Instance.props.invalidFields.length, 1, 'There is one invalid field');
        assert.is(Instance.props.invalidFields[0], 'password', 'It should be password');

        setTimeout(() => {
            props.password = 123456;
            TestUtils.Simulate.change(password, {target: {value: props.password}});

            setTimeout(() => {
                assert.notOk(Instance.props.invalidFields.length, 'There are no invalid fields');
                assert.end();
            }, 100);
        }, 100);
    }, 100);

    assert.plan(9);
});
