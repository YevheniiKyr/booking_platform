module.exports = function validateQueryParams(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        if (error) {
            return res.status(400).json({ message: "Query parameter " + error.details[0].message });
        }
        next();
    };
};
