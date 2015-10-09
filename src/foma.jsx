import React from 'react';
import FomaWarning from 'foma-warning';

const { Component, PropTypes } = React;

export default Foma => {
    return class extends Component {
        static displayName = 'Foma';

        constructor (props, context) {
            super(props, context);

            this.state = {
                invalidFields: [],
                isInvalid: false,
                isValid: true,
                isValidating: false,
                isWarnVisible: false,
                childrenInvalidFields: []
            };

            this.api = {
                foma: {
                    setValidationInfo: ::this.setValidationInfo,
                    setChildrenValidationInfo: ::this.setChildrenValidationInfo,
                    viewWarning: ::this.viewWarning,
                    renderWarning: ::this.renderWarning
                }
            };

            // I want to manage fields without re-render
            this.fields = {};
        }

        _manageInvalidFields (invalidFields, validatorInfo, idx) {
            this.setState({
                isValidating: true,
                isValid: false,
                isInvalid: true
            });

            // Invalid and NOT found
            if (idx === -1) {
                invalidFields.push(validatorInfo.name);
            }

            // Valid and FOUND
            else  {
                invalidFields.splice(idx, 1);
            }

            return invalidFields;
        }

        /**
         * Validation method for All form fields. All fields are required.
         * @param {Object} validatorInfo - information from validator (Valya)
         * @param {Boolean} validatorInfo#isValid - validation flag for the field
         * @param {String} validatorInfo#message - validatation message for the field
         * @param {String} validatorInfo#name - name of the field
         */
        setValidationInfo (validatorInfo) {
            var invalidFields = this.state.invalidFields.slice();
            var childrenInvalidFields = this.state.childrenInvalidFields;
            var idx = invalidFields.indexOf(validatorInfo.name);

            // Valid and NOT found ===OR=== Invalid and FOUND
            if (validatorInfo.isValid && idx === -1 || !validatorInfo.isValid && idx !== -1) {
                return;
            }

            invalidFields = this._manageInvalidFields(invalidFields, validatorInfo, idx);

            // Made for future features, may be...
            this.fields[validatorInfo.name] = validatorInfo;

            this.setState({
                isValidating: false,
                isValid: !invalidFields.length && !childrenInvalidFields.length,
                isInvalid: Boolean(invalidFields.length) || Boolean(childrenInvalidFields.length),
                invalidFields: invalidFields
            });

        }

        /**
         * Validation method for child Foma instances. All fields are required.
         * @param {Object} validatorInfo - information from validator (Valya)
         * @param {Boolean} validatorInfo#isValid - validation flag for the field
         * @param {String} validatorInfo#message - validatation message for the field
         * @param {String} validatorInfo#name - name of the field
         */
        setChildrenValidationInfo (validatorInfo) {
            var invalidFields = this.state.invalidFields;
            var childrenInvalidFields = this.state.childrenInvalidFields.slice();
            var idx = childrenInvalidFields.indexOf(validatorInfo.name);

            // Valid and NOT found ===OR=== Invalid and FOUND
            if (validatorInfo.isValid && idx === -1 || !validatorInfo.isValid && idx !== -1) {
                return;
            }

            childrenInvalidFields = this._manageInvalidFields(childrenInvalidFields, validatorInfo, idx);

            this.setState({
                isValidating: false,
                isValid: !invalidFields.length && !childrenInvalidFields.length,
                isInvalid: Boolean(invalidFields.length) || Boolean(childrenInvalidFields.length),
                childrenInvalidFields: childrenInvalidFields
            });
        }

        viewWarning (bool) {
            this.setState({isWarnVisible: bool ? Date.now() : bool});
        }

        renderWarning ({message, items}) {
            return (
                <FomaWarning
                    message={message}
                    items={items}
                    visible={this.state.isWarnVisible}>
                </FomaWarning>
            );
        }

        render () {
            return (
                <Foma {...this.api} {...this.props} {...this.state}>
                    {this.props.children}
                </Foma>
            );
        }
    }
}
