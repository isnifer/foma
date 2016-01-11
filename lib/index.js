'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fomaWarning = require('foma-warning');

var _fomaWarning2 = _interopRequireDefault(_fomaWarning);

exports['default'] = function (fields) {
    var validationType = arguments.length <= 1 || arguments[1] === undefined ? 'blur' : arguments[1];

    return function (FormComponent) {
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
                var _this = this;

                _classCallCheck(this, _class);

                _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props, context);

                var updatedFields = {};
                var fieldKeys = [];

                if (fields instanceof Array) {
                    fields = fields.reduce(function (result, item) {
                        result[item.name] = item;
                        fieldKeys.push(item.name);
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

                fieldKeys.forEach(function (key) {
                    var fields = Object.assign({}, _this.state.fields);
                    var field = fields[key];

                    // props
                    field.name = field.name || key;
                    field.value = field.value || null;

                    _this._validate(field.value, key, true);

                    // handlers
                    field.onChange = function (_ref) {
                        var target = _ref.target;

                        console.log('CHANGE');
                        var currentFields = Object.assign({}, _this.state.fields);
                        var field = Object.assign({}, currentFields[key]);

                        if (field.filters) {
                            field.value = field.filters[0](target.value);
                        } else {
                            field.value = target.value;
                        }

                        currentFields = _extends({}, currentFields, _defineProperty({}, key, field));
                        _this.setState({ fields: currentFields });
                    };

                    field.onBlur = function (_ref2) {
                        var target = _ref2.target;

                        console.log('BLUR');
                        _this._validate(target.value, key);
                    };
                });

                this.api = {
                    setChildrenValidationInfo: this.setChildrenValidationInfo.bind(this),
                    viewWarning: this.viewWarning.bind(this),
                    renderWarning: this.renderWarning.bind(this),
                    setValues: this.setValues.bind(this)
                };

                this.fieldKeys = fieldKeys;
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
                value: function setValidationInfo(_ref3) {
                    var isValid = _ref3.isValid;
                    var isValidating = _ref3.isValidating;
                    var name = _ref3.name;

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
                value: function setChildrenValidationInfo(_ref4) {
                    var isValid = _ref4.isValid;
                    var isValidating = _ref4.isValidating;
                    var name = _ref4.name;

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
                value: function renderWarning(_ref5) {
                    var _this2 = this;

                    var message = _ref5.message;

                    return _react2['default'].createElement(_fomaWarning2['default'], {
                        message: message,
                        items: this.invalidFields.concat(this.state.childrenInvalidFields).map(function (fieldName) {
                            return {
                                fieldName: fieldName,
                                name: _this2.state.fields[fieldName].tip
                            };
                        }),
                        visible: this.state.isWarnVisible });
                }
            }, {
                key: 'setValues',
                value: function setValues(values) {
                    var fields = Object.assign({}, this.state.fields, values);
                    this.setState({ fields: fields });
                }
            }, {
                key: '_onFinishValidation',
                value: function _onFinishValidation(field, initial, message) {
                    if (!initial) {
                        field.error = message || null;
                    }

                    field.initError = message || null;

                    var idx = this.invalidFields.indexOf(field.name);
                    var fields = _extends({}, this.state.fields, _defineProperty({}, field.name, field));
                    var isValid = false;

                    if (!message) {
                        isValid = this.fieldKeys.reduce(function (result, item) {
                            return !(!result || fields[item].initError);
                        }, true);

                        if (idx !== -1) {
                            this.invalidFields.splice(idx, 1);
                        }
                    } else {
                        if (idx === -1) {
                            this.invalidFields.push(field.name);
                        }
                    }

                    delete this.validatingFields[field.name];

                    var isValidating = Boolean(Object.keys(this.validatingFields).length);
                    console.log(message);
                    console.log(isValidating);
                    var state = {
                        fields: fields,
                        isValid: isValid,
                        isInvalid: !isValid,
                        isValidating: isValidating
                    };

                    this.setState(state);
                }
            }, {
                key: '_validate',
                value: function _validate(value, name, initial) {
                    var fields = this.state.fields;
                    var field = Object.assign({}, fields[name]);
                    var validators = field.validators;

                    this.validatingFields[name] = true;

                    if (!this.state.isValidating) {
                        console.log('YAPPI');
                        this.setState({ isValidating: true });
                    }

                    validators.reduce(function (sequence, next) {
                        return sequence.then(function () {
                            return next.validator(value, next.params);
                        });
                    }, Promise.resolve()).then(this._onFinishValidation.bind(this, field, initial))['catch'](this._onFinishValidation.bind(this, field, initial));
                }
            }, {
                key: 'render',
                value: function render() {
                    var props = {
                        foma: _extends({
                            invalidFields: this.invalidFields
                        }, this.api, this.state, this.props)
                    };

                    return _react2['default'].createElement(FormComponent, props);
                }
            }]);

            return _class;
        })(_react.Component);
    };
};

module.exports = exports['default'];
