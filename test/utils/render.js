import React from 'react';
import TestUtils from 'react-addons-test-utils';

const render = (component, props, ...children) => {
    const shallowRenderer = TestUtils.createRenderer();

    shallowRenderer.render(
        React.createElement(
            component,
            props,
            ...children
        )
    );

    return shallowRenderer.getRenderOutput();
}

export default { render, TestUtils }
