exports.createPostValidator = (req, res, next) => {
    req.check('title', "Write a title").notEmpty();
    req.check('title', "Title must be between 4 to 150 characters").isLength({
        min: 4,
        max: 150
    });
    req.check('body', "Write a body").notEmpty();
    req.check('body', "Body must be between 4 to 2000 characters").isLength({
        min: 4,
        max: 2000
    });

    const errors = req.validationErrors();
    if (errors) {
        const error = errors.map(error => error.msg)[0];
        return res.status(400).json({ error })
    }
    next();
}