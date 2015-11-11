export const standardValidator = {
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

export const asyncValidator = {
    validator: (value, params) => {
        return new Promise ((resolve, reject) => {
            setTimeout(() => {
                if (value) {
                    resolve();
                } else {
                    reject(params.message);
                }
            }, 1000);
        });
    },
    params: {
        message: 'Your name should be not empty'
    }
};
