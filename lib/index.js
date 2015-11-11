'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fomaWarning = require('foma-warning');

var _fomaWarning2 = _interopRequireDefault(_fomaWarning);

exports['default'] = function (Foma) {
    return (function (_Component) {
        _inherits(_class, _Component);

        _createClass(_class, null, [{
            key: 'displayName',
            value: 'Foma',

            // If current Foma instance is a child
            enumerable: true
        }, {
            key: 'contextTypes',
            value: {
                foma: _react.PropTypes.object
            },

            // For this instance children - Foma or Valya
            enumerable: true
        }, {
            key: 'childContextTypes',
            value: {
                foma: _react.PropTypes.object.isRequired
            },
            enumerable: true
        }]);

        function _class(props, context) {
            _classCallCheck(this, _class);

            _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props, context);

            this.state = {
                isInvalid: true,
                isValid: false,
                isWarnVisible: false,
                isValidating: true,
                childrenInvalidFields: []
            };

            this.api = {
                foma: {
                    setChildrenValidationInfo: this.setChildrenValidationInfo.bind(this),
                    viewWarning: this.viewWarning.bind(this),
                    renderWarning: this.renderWarning.bind(this)
                }
            };

            // I want to manage fields without re-render
            this.fields = {};
            this.invalidFields = [];
            this.validatingFields = [];
        }

        _createClass(_class, [{
            key: 'getChildContext',
            value: function getChildContext() {
                return {
                    foma: {
                        setValidationInfo: this.setValidationInfo.bind(this),
                        setChildrenValidationInfo: this.setChildrenValidationInfo.bind(this)
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
        }, {
            key: '_updateInvalidFields',
            value: function _updateInvalidFields(invalidFields, name, idx) {

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
        }, {
            key: 'setValidationInfo',
            value: function setValidationInfo(_ref) {
                var isValid = _ref.isValid;
                var isValidating = _ref.isValidating;
                var name = _ref.name;

                var invalidFields = this.invalidFields.slice();
                var childrenInvalidFields = this.state.childrenInvalidFields;
                var idx = invalidFields.indexOf(name);
                var idxIsValidating = this.validatingFields.indexOf(name);

                // We will be store info about fields in Foma
                // and update that when it will be need
                this.fields[name] = { isValid: isValid, isValidating: isValidating, name: name };

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
        }, {
            key: 'setChildrenValidationInfo',
            value: function setChildrenValidationInfo(_ref2) {
                var isValid = _ref2.isValid;
                var isValidating = _ref2.isValidating;
                var name = _ref2.name;

                var invalidFields = this.invalidFields;
                var childrenInvalidFields = this.state.childrenInvalidFields.slice();
                var idx = childrenInvalidFields.indexOf(name);

                this.fields[name] = { isValid: isValid, isValidating: isValidating, name: name };

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
        }, {
            key: 'viewWarning',
            value: function viewWarning(bool) {
                this.setState({ isWarnVisible: bool ? Date.now() : bool });
            }
        }, {
            key: 'renderWarning',
            value: function renderWarning(_ref3) {
                var _this = this;

                var message = _ref3.message;
                var requiredFields = _ref3.requiredFields;

                return _react2['default'].createElement(_fomaWarning2['default'], {
                    message: message,
                    items: this.invalidFields.concat(this.state.childrenInvalidFields).map(function (fieldName) {

                        if (requiredFields) {
                            var item = requiredFields[fieldName];

                            return {
                                fieldName: fieldName,
                                name: item.name,
                                handler: item.handler
                            };
                        }

                        return {
                            fieldName: fieldName,
                            name: _this.fields[fieldName].name
                        };
                    }),
                    visible: this.state.isWarnVisible });
            }
        }, {
            key: 'render',
            value: function render() {
                var invalidFields = { invalidFields: this.invalidFields };

                return _react2['default'].createElement(
                    Foma,
                    _extends({}, this.api, this.props, this.state, invalidFields),
                    this.props.children
                );
            }
        }]);

        return _class;
    })(_react.Component);
};

module.exports = exports['default'];
