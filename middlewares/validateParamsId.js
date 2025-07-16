const Joi = require("joi");

function getAllErrors(errors) {
    let res = []
    errors.map(err => res.push("Request param " + err.key + " " + err.error.details[0].message))
    return res;
}

module.exports = function validateParamsId() {
    const schema = Joi.string().length(24).hex().required();
    return (req, res, next) => {
        let errors = []
        for (const [key, value] of Object.entries(req.params)){
            const { error } = schema.validate(value);
            if (error) errors.push({key, error});
        }
        if (errors.length) {
            return res.status(400).json({ messages: getAllErrors(errors) });
        }
        next();
    };
};
