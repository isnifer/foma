import React, { Component } from 'react';
import { render } from 'react/lib/ReactDOM';
import Foma from '../../lib/index';
import { Validator } from './valya';
import { standardValidator, asyncValidator } from './validators';

const browsers = ['chrome', 'firefox', 'opera', 'safari'];

const fields = {
    username: {
        validators: [standardValidator],
        tip: 'username'
    },
    async: {
        validators: [asyncValidator],
        tip: 'async username'
    },
    browser: {
        validators: [standardValidator],
        handler: () => { alert('Please, select browser before!'); },
        tip: 'ваш любимый браузер'
    }
};

@Foma(fields)
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
        if (this.props.foma.isValid) {
            alert('You\'re awesome');
        } else {
            this.props.foma.viewWarning(true);
        }

        return event.preventDefault();
    }

    setBrowser (browser) {
        this.setState({browser: browser});
    }

    componentDidMount () {
        /*this.props.foma.api.setValues({
            username: {
                value: 'Anton'
            },
            async: {
                value: 'isnifer'
            },
            browser: {
                value: 'opera'
            }
        });*/
    }

    render () {
        const { fields } = this.props.foma;

        return (
            <form name="formName" style={{width: '500px', padding: '50px 0 0 50px'}} noValidate>
                <div className="form-group">
                    {this.props.foma.isValidating &&
                        <h1>Validating</h1>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="username">Type your username</label>
                    <span className="validator">
                        <span className="validator__target">
                            <input type="text" className="form-control" {...fields.username} />
                        </span>
                        {fields.username.error &&
                            <span className="validator__error">
                                {fields.username.error}
                            </span>
                        }
                    </span>
                </div>
                <div className="form-group">
                    <label htmlFor="async">Type your async username (invalid name isnifer)</label>
                    <span className="validator">
                        <span className="validator__target">
                            <input type="text" className="form-control" {...fields.async} />
                        </span>
                        {fields.async.error &&
                            <span className="validator__error">
                                {fields.async.error}
                            </span>
                        }
                    </span>
                </div>
                <div className="form-group">
                    {browsers.map(browser => {
                        return (
                            <div
                                className={browser + (fields.browser.value === browser ? ' selected' : '')}
                                onClick={this.setBrowser.bind(this, browser)}
                                key={browser}>
                                {browser}
                            </div>
                        );
                    })}
                </div>
                {<div className="form-group">
                    {this.props.foma.renderWarning({message: 'These fields are required:'})}
                </div>}
                <div className="form-group">
                    <button
                        type="button"
                        className={'btn btn-success' +
                            (this.props.foma.isInvalid || this.props.foma.isValidating ? ' btn-danger' : '')}
                        onClick={::this.submitForm}>
                        OK! Watch me magic!
                    </button>
                </div>
            </form>
        );
    }
}

render(<FormDemo />, document.querySelector('.main'));
