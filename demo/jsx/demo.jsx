import React from 'react';
import ReactDOM from 'react-dom';
import Valya from 'valya';
import Foma from '../../lib/index';
import assign from 'object-assign';

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

let groupFieldValidator = (fieldName, invalidFields) => {
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
            message: fieldName + ' is required!'
        }
    }
};

/*const groupValidator = (...fieldNames) => {
    return {
        validator: (value, params) => {
            if (value) {
                return Promise.resolve();
            }

            return Promise.reject(params.message);
        },
        params: {
            message: 'All fiedls are required'
        }
    };
};*/

@Foma
class GroupComponent extends Component {
    static displayName = 'GroupComponent';

    static propTypes = {
        index: PropTypes.number.isRequired,
        group: PropTypes.object.isRequired,
        setGroupField: PropTypes.func.isRequired,
        updateParentValidation: PropTypes.func.isRequired,
        allGroups: PropTypes.array.isRequired,
        allInvalidGroups: PropTypes.number.isRequired
    }

    onEndCallback (name) {
        return (isValid, message) => {
            this.props.foma.setValidationInfo({isValid, message, name});
        }
    }

    renderFields (fields) {
        return fields.map((field, i) => {
            return (
                <div className="form-group" key={i}>
                    <Validator
                        value={this.props.group[field]}
                        onEnd={this.onEndCallback(field)}
                        validators={[groupFieldValidator(field, this.props.invalidFields)]}
                        initialValidation={true}>
                        <input
                            type="text"
                            id={field}
                            name={field}
                            placeholder={field}
                            className="form-control"
                            value={this.props.group[field]}
                            onChange={this.props.setGroupField.bind(this, field, this.props.index)} />
                    </Validator>
                </div>
            );
        });
    }

    groupOnEndCallback (name) {
        return (isValid, message) => {
            this.props.updateParentValidation({isValid, message, name});
        };
    }

    render () {
        let fields = Object.keys(groupFields);

        return (
            <div className="form-field">
                {this.renderFields(fields)}

                <Validator
                    value={this.props.group}
                    onEnd={this.groupOnEndCallback('group ' + (this.props.index + 1))}
                    initialValidation={true}
                    validators={[
                        {
                            validator: (group, params) => {
                                var notEmptyFields = fields.filter(function (e, i) {
                                    return !(group[e] === '' || !group[e]);
                                });

                                var allFieldsAreEmpty = !notEmptyFields.length;
                                var allRequiredFieldsFilled = notEmptyFields.length === fields.length;

                                if (allFieldsAreEmpty) {

                                    // Если групп две и более, то надо
                                    // проверить индекс конкретной группы
                                    // если он 0, то реджектить
                                    if (this.props.allGroups.length === 1) {
                                        return Promise.reject(params.allFieldsRequired);
                                    }

                                    if (this.props.allGroups.length > 1 && !this.props.index) {
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
            username: null,
            password: null,
            browser: null,
            groups: [
                {
                    company: null,
                    state: null,
                    position: null
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

    onEndCallback (name) {
        return (isValid, message) => {
            this.props.foma.setValidationInfo({isValid, message, name});
        };
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
                        onEnd={this.onEndCallback('username')}
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
                        onEnd={this.onEndCallback('password')}
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
                        onEnd={this.onEndCallback('browser')}
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

                {this.state.groups.map((group, i) => {
                    var props = {
                        group: group,
                        allGroups: this.state.groups,
                        allInvalidGroups: this.props.childrenInvalidFields.length,
                        setGroupField: ::this.setGroupField,
                        updateParentValidation: ::this.props.foma.setChildrenValidationInfo,
                        index: i,
                        key: i
                    };

                    return <GroupComponent {...props} />;
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
