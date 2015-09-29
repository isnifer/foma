import '../utils/jsdom';
import test from 'tape';
import React from 'react';
import { render, TestUtils } from '../utils/render';
import Foma from '../../lib/index';
import TestForm from './components/TestForm';

const { Component, PropTypes } = React;

test('Should be inited', assert => {
    assert.true(typeof Foma === 'function', 'Foma inited');
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
