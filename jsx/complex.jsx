import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Valya from 'valya';
import Foma from '../../lib/index';
import assign from 'object-assign';
import { standardValidator, asyncValidator } from './validators';

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

const groupFields = {
    company: {
        name: 'ex-company'
    },
    state: {
        name: 'state'
    },
    position: {
        name: 'ex-position'
    }
};

let groupFieldValidator = (fieldName, field, invalidFields) => {
    return {
        validator: (value, params) => {
            if (value && parseInt(value) === 10 ||
                !value && !invalidFields.length ||
                !value && invalidFields.length === 1 && invalidFields[0] === fieldName) {
                return Promise.resolve();
            }

            return Promise.reject(params.message);
        },
        params: {
            message: field + ' should be equal 10!'
        }
    }
};

@Foma
class GroupComponent extends Component {
    static displayName = 'GroupComponent';

    static propTypes = {
        index: PropTypes.number.isRequired,
        group: PropTypes.object.isRequired,
        setGroupField: PropTypes.func.isRequired,
        allGroups: PropTypes.array.isRequired,
        allInvalidGroups: PropTypes.number.isRequired,
        setParentValidation: PropTypes.func.isRequired
    }

    renderFields (fields) {
        return fields.map((field, i) => {

            const fieldName = field + '_' + this.props.index;

            return (
                <div className="form-group" key={i}>
                    <label htmlFor={fieldName}>{field}</label>
                    <Validator
                        value={this.props.group[field]}
                        name={fieldName}
                        validators={[groupFieldValidator(fieldName, field, this.props.invalidFields)]}
                        onEnd={(isValid, message) => {
                            this.props.setParentValidation({
                                isValid,
                                isValidating: false,
                                name: fieldName
                            });
                        }}
                        silentInitValidation={true}>
                        <input
                            type="text"
                            id={fieldName}
                            name={fieldName}
                            placeholder={field}
                            className="form-control"
                            value={this.props.group[field]}
                            onChange={this.props.setGroupField.bind(this, field, this.props.index)} />
                    </Validator>
                </div>
            );
        });
    }

    render () {
        let fields = Object.keys(groupFields);

        return (
            <div className="form-field">
                {this.renderFields(fields)}

                <Validator
                    value={this.props.group}
                    name={'group ' + (this.props.index + 1)}
                    silentInitValidation={true}
                    customInformer={true}
                    validators={[
                        {
                            validator: (group, params) => {
                                var notEmptyFields = fields.filter((e, i) => {
                                    return !(group[e] === '' || !group[e]);
                                });

                                var allFieldsAreEmpty = !notEmptyFields.length;
                                var allRequiredFieldsFilled = notEmptyFields.length === fields.length;

                                if (allFieldsAreEmpty) {

                                    let { allGroups, index, allInvalidGroups } = this.props;

                                    if (allGroups.length === 1) {
                                        return Promise.reject(params.allFieldsRequired);
                                    }

                                    if (allInvalidGroups === 1 && allGroups.length > 1) {
                                        return Promise.reject(params.allFieldsRequired);
                                    }

                                    return Promise.resolve();
                                }

                                if (allRequiredFieldsFilled) {
                                    return new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            if (this.props.isValid) {
                                                resolve();
                                            } else {
                                                reject(params.haveInvalidFields)
                                            }
                                        }, 0);
                                    });
                                }

                                return Promise.reject(params.allFieldsRequired);
                            },
                            params: {
                                allFieldsRequired: 'All fields are required',
                                haveInvalidFields: 'You have invalid fields, fix it'
                            }
                        }
                    ]}>
                </Validator>
            </div>
        );
    }
}

@Foma
class FormDemo extends Component {
    static displayName = 'FormDemo';

    constructor (props, context) {
        super(props, context);

        this.state = {
            async: 'Anton',
            username: 123123,
            password: 123123,
            browser: 'opera',
            groups: [
                {
                    company: 10,
                    state: 10,
                    position: 10
                }
            ]
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

    setGroupField (name, index, e) {
        let groups = this.state.groups;
        let group = assign({}, groups[index]);

        group[name] = e.target.value;
        groups[index] = group;

        this.setState({groups: groups});
    }

    addGroup () {
        let groups = this.state.groups.concat({
            company: null,
            state: null,
            position: null
        });

        this.setState({groups: groups});
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
                        name="username"
                        tip="awesome username"
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
                    <label htmlFor="password">Type your password</label>
                    <Validator
                        value={this.state.password}
                        name="password"
                        tip="awesome password"
                        validators={[standardValidator]}
                        silentInitValidation={true}>
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
                    <label htmlFor="async">Type your async name</label>
                    <Validator
                        value={this.state.async}
                        name="async"
                        tip="awesome async"
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
                        tip="the best ever browser"
                        handler={() => {
                            alert('Please, select browser before!');
                        }}
                        validators={[standardValidator]}
                        silentInitValidation={true}>
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

                {this.state.groups.map((group, i) => {
                    var props = {
                        group: group,
                        allGroups: this.state.groups,
                        allInvalidGroups: this.props.childrenInvalidFields.length,
                        setGroupField: ::this.setGroupField,
                        setParentValidation: this.props.foma.setChildrenValidationInfo,
                        index: i,
                        key: i
                    };

                    return <GroupComponent ref={'group_' + i} {...props} />;
                })}

                <div className="form-group">
                    <button
                        type="button"
                        onClick={::this.addGroup}
                        className="btn btn-info">
                        Add group fields
                    </button>
                </div>

                <div className="form-group">
                    {this.props.foma.renderWarning({
                        message: 'These fields are required:'
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

ReactDOM.render(<FormDemo />, document.querySelector('.main'));
