import React from 'react';

const { Component, PropTypes } = React;

export default Foma => {
    return class extends Component {
        static displayName = 'Foma';

        constructor (props, context) {
            super(props, context);

            this.state = {
                isValid: true,
                isValidating: false,
                isInvalid: false,
                invalidFields: []
            };

            this.api = {
                setValidationInfo: this.setValidationInfo.bind(this)
            };

            // I want to manage fields without re-render
            this.fields = {};
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
            var idx = invalidFields.indexOf(validatorInfo.name);

            // If Valya returned isValid and the field was valid before
            // we will don't do anything
            if (idx === -1 && validatorInfo.isValid) {
                return;
            }

            this.setState({isValidating: true});

            if (!validatorInfo.isValid) {
                invalidFields.push(validatorInfo.name);
            } else {
                if (idx !== -1) {
                    invalidFields.splice(idx, 1);
                }
            }

            this.fields[validatorInfo.name] = validatorInfo;

            this.setState({
                isValidating: false,
                isValid: !invalidFields.length,
                isInvalid: Boolean(invalidFields.length),
                invalidFields: invalidFields
            });

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
