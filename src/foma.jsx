import React, { Component, PropTypes } from 'react';
import FomaWarning from 'foma-warning';

export default (fields, validationType = 'blur') => {
    return function (FormComponent) {
        return class extends Component {
            static displayName = 'Foma';

            // If current Foma instance is a child
            static contextTypes = {
                foma: PropTypes.object
            };

            // For this instance children - Foma or Valya
            static childContextTypes = {
                foma: PropTypes.object.isRequired
            };

            constructor (props, context) {
                super(props, context);

                let updatedFields = {};
                let fieldKeys = [];

                if (fields instanceof Array) {
                    fields = fields.reduce((result, item) => {
                        result[item.name] = item;
                        fieldKeys.push(item.name)
                    }, {});
                } else {
                    updatedFields = fields;
                    fieldKeys = Object.keys(fields);
                }

                this.state = {
                    isInvalid: true,
                    isValid: false,
                    isWarnVisible: false,
                    isValidating: true,
                    fields: updatedFields,
                    childrenInvalidFields: []
                };

                // I want to manage fields without re-render
                this.fields = {};
                this.invalidFields = [];
                this.validatingFields = {};

                fieldKeys.forEach(key => {
                    let fields = Object.assign({}, this.state.fields);
                    let field = fields[key];

                    // props
                    field.name = field.name || key;
                    field.value = field.value || null;

                    this._validate(field.value, key, true);

                    // handlers
                    field.onChange = ({target}) => {
                        console.log('CHANGE')
                        let currentFields = Object.assign({}, this.state.fields);
                        const field = Object.assign({}, currentFields[key]);

                        if (field.filters) {
                            field.value = field.filters[0](target.value);
                        } else {
                            field.value = target.value;
                        }

                        currentFields = {...currentFields, ...{[key]: field}};
                        this.setState({fields: currentFields});
                    };

                    field.onBlur = ({target}) => {
                        console.log('BLUR')
                        this._validate(target.value, key);
                    };
                });

                this.api = {
                    setChildrenValidationInfo: ::this.setChildrenValidationInfo,
                    viewWarning: ::this.viewWarning,
                    renderWarning: ::this.renderWarning,
                    setValues: ::this.setValues
                };

                this.fieldKeys = fieldKeys;
            }

            getChildContext () {
                return {
                    foma: {
                        setValidationInfo: ::this.setValidationInfo,
                        setChildrenValidationInfo: ::this.setChildrenValidationInfo
                    }
                };
            }

            /**
             * Common part for managing invalid fields
             * @param  {Array} invalidFields - invalid fields array
             * @param  {String} name - name of current field
             * @param  {Number} idx - field's index in array
             * @return {Array}
             */
            _updateInvalidFields (invalidFields, name, idx) {

                // Invalid and NOT found
                if (idx === -1) {
                    invalidFields.push(name);
                }

                // Valid and FOUND
                else {
                    invalidFields.splice(idx, 1);
                }

                return invalidFields;
            }

            /**
             * Validation method for All form fields. All fields are required.
             * @param {Boolean} isValid - validation flag for the field
             * @param {Boolean} isValidating - is validation in progress?
             * @param {String} name - name of the field
             */
            setValidationInfo ({isValid, isValidating, name}) {
                var invalidFields = this.invalidFields.slice();
                var childrenInvalidFields = this.state.childrenInvalidFields;
                var idx = invalidFields.indexOf(name);
                var idxIsValidating = this.validatingFields.indexOf(name);

                // We will be store info about fields in Foma
                // and update that when it will be need
                this.fields[name] = {isValid, isValidating, name};

                if (isValidating && idxIsValidating === -1) {
                    this.validatingFields.push(name);
                }

                if (!isValidating) {
                    this.validatingFields.splice(idxIsValidating, 1);
                }

                // (NOT Valid and NOT found in invalidFields) and validation in progress
                if (!isValid && isValidating && name && idx === -1) {
                    this.invalidFields = invalidFields.concat(name);

                    if (!this.state.isValidating) {
                        this.setState({
                            isValidating: true,
                            isValid: false,
                            isInvalid: true
                        });
                    }

                    return;
                }

                // Valid and NOT found ===OR=== Invalid and FOUND
                if (isValid && idx === -1 || !isValid && idx !== -1) {
                    return;
                }

                // (Invalid and NOT found ===OR=== Valid and FOUND) and validation end
                invalidFields = this._updateInvalidFields(invalidFields, name, idx);

                this.setState({
                    isValidating: false,
                    isValid: !invalidFields.length && !childrenInvalidFields.length,
                    isInvalid: Boolean(invalidFields.length) || Boolean(childrenInvalidFields.length)
                });

                this.invalidFields = invalidFields;
            }

            /**
             * Validation method for child Foma instances. All fields are required.
             * @param {Boolean} isValid - validation flag for the field
             * @param {Boolean} isValidating - is validation in progress
             * @param {String} name - name of the field
             */
            setChildrenValidationInfo ({isValid, isValidating, name}) {
                var invalidFields = this.invalidFields;
                var childrenInvalidFields = this.state.childrenInvalidFields.slice();
                var idx = childrenInvalidFields.indexOf(name);

                this.fields[name] = {isValid, isValidating, name};

                // Valid and NOT found ===OR=== Invalid and FOUND
                if (isValid && idx === -1 || !isValid && idx !== -1) {
                    return;
                }

                childrenInvalidFields = this._updateInvalidFields(childrenInvalidFields, name, idx);

                this.setState({
                    isValid: !invalidFields.length && !childrenInvalidFields.length,
                    isInvalid: Boolean(invalidFields.length) || Boolean(childrenInvalidFields.length),
                    childrenInvalidFields: childrenInvalidFields
                });
            }

            viewWarning (bool) {
                this.setState({isWarnVisible: bool ? Date.now() : bool});
            }

            renderWarning ({message}) {
                return (
                    <FomaWarning
                        message={message}
                        items={this.invalidFields.concat(this.state.childrenInvalidFields).map(fieldName => {
                            return {
                                fieldName,
                                name: this.state.fields[fieldName].tip
                            }
                        })}
                        visible={this.state.isWarnVisible}>
                    </FomaWarning>
                );
            }

            setValues (values) {
                let fields = Object.assign({}, this.state.fields, values);
                this.setState({fields});
            }

            _onFinishValidation (field, initial, message) {
                if (!initial) {
                    field.error = message || null;
                }

                field.initError = message || null;

                const idx = this.invalidFields.indexOf(field.name);
                const fields = {...this.state.fields, ...{[field.name]: field}};
                let isValid = false;

                if (!message) {
                    isValid = this.fieldKeys.reduce((result, item) => !(!result || fields[item].initError), true);

                    if (idx !== -1) {
                        this.invalidFields.splice(idx, 1);
                    }
                } else {
                    if (idx === -1) {
                        this.invalidFields.push(field.name);
                    }
                }

                delete this.validatingFields[field.name];

                const isValidating = Boolean(Object.keys(this.validatingFields).length);
                console.log(message)
                console.log(isValidating)
                const state = {
                    fields,
                    isValid,
                    isInvalid: !isValid,
                    isValidating
                };

                this.setState(state);
            }

            _validate (value, name, initial) {
                const fields = this.state.fields;
                let field = Object.assign({}, fields[name]);
                let { validators } = field;

                this.validatingFields[name] = true;

                if (!this.state.isValidating) {
                    console.log('YAPPI')
                    this.setState({isValidating: true});
                }

                validators
                    .reduce(
                        (sequence, next) => sequence.then(() => next.validator(value, next.params)),
                        Promise.resolve()
                    )
                    .then(this._onFinishValidation.bind(this, field, initial))
                    .catch(this._onFinishValidation.bind(this, field, initial));
            }

            render () {
                const props = {
                    foma: {
                        invalidFields: this.invalidFields,
                        ...this.api,
                        ...this.state,
                        ...this.props
                    }
                };

                return (
                    <FormComponent {...props} />
                );
            }
        }
    }
}
