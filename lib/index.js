'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Component = _react2['default'].Component;
var PropTypes = _react2['default'].PropTypes;

exports['default'] = function (Foma) {
    return (function (_Component) {
        _inherits(_class, _Component);

        _createClass(_class, null, [{
            key: 'displayName',
            value: 'Foma',
            enumerable: true
        }]);

        function _class(props, context) {
            _classCallCheck(this, _class);

            _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props, context);

            this.state = {
                isValid: true,
                isValidating: false,
                isInvalid: false,
                invalidFields: [],
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

        _createClass(_class, [{
            key: 'setValidationInfo',
            value: function setValidationInfo(validatorInfo) {
                var invalidFields = this.state.invalidFields.slice();
                var idx = invalidFields.indexOf(validatorInfo.name);

                // If Valya returned isValid and the field was valid before
                // we will don't do anything
                if (idx === -1 && validatorInfo.isValid) {
                    return;
                }

                this.setState({ isValidating: true });

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
        }, {
            key: 'render',
            value: function render() {
                return _react2['default'].createElement(
                    Foma,
                    _extends({}, this.props, this.state),
                    this.props.children
                );
            }
        }]);

        return _class;
    })(Component);
};

module.exports = exports['default'];
