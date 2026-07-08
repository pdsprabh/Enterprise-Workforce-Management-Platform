exports.validateLogin = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    next();
};

exports.validateRegistration = (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ success: false, message: 'Please provide required fields' });
    }
    next();
};
