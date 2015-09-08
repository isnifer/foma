import React from 'react';

export default Foma => {
    return class extends React.Component {
        static displayName = 'Foma';

        constructor (props, context) {
            super(props, context);

            this.state = {
                isValid: true,
                isValidating: false,
                isInvalid: false,
                invalidFields: []
            };
        }

        componentWillReceiveProps (nextProps) {
            if (nextProps.fields && nextProps.fields.length) {
                this.setState({isValidating: true});

                var result = nextProps.fields.reduce(function (result, item) {
                    if (item && !item.isValid) {
                        result.push(item);
                    }
                    return result;
                }, []);

                this.setState({
                    isValidating: false,
                    isValid: !result.length,
                    isInvalid: Boolean(result.length),
                    invalidFields: result
                });
            }
        }

        render () {
            return (
                <Foma {...this.props} {...this.state}>
                    {this.props.children}
                </Foma>
            );
        }
    }
}
