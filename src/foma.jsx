import React, { Component, PropTypes } from 'react';
import FomaWarning from 'foma-warning';

export default Foma => {
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

            this.state = {
                isInvalid: true,
                isValid: false,
                isWarnVisible: false,
                isValidating: true,
                childrenInvalidFields: []
            };

            this.api = {
                foma: {
                    setChildrenValidationInfo: ::this.setChildrenValidationInfo,
                    viewWarning: ::this.viewWarning,
                    renderWarning: ::this.renderWarning
                }
            };

            // I want to manage fields without re-render
            this.fields = {};
            this.invalidFields = [];
            this.validatingFields = [];
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

        renderWarning ({message, requiredFields}) {
            return (
                <FomaWarning
                    message={message}
                    items={this.invalidFields.concat(this.state.childrenInvalidFields).map((fieldName) => {

                        if (requiredFields) {
                            let item = requiredFields[fieldName];

                            return {
                                fieldName,
                                name: item.name,
                                handler: item.handler
                            }
                        }

                        return {
                            fieldName,
                            name: this.fields[fieldName].name
                        }
                    })}
                    visible={this.state.isWarnVisible}>
                </FomaWarning>
            );
        }

        render () {
            const invalidFields = {invalidFields: this.invalidFields};

            return (
                <Foma {...this.api} {...this.props} {...this.state} {...invalidFields}>
                    {this.props.children}
                </Foma>
            );
        }
    }
}
