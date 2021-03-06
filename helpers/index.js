const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@node-react.com" };

exports.sendEmail = emailData => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_CREDENTIALS,
            pass: process.env.PASSWORD_CREDENTIALS
        }
    });
    return (
        transporter
            .sendMail(emailData)
            .then(info => console.log(`Message sent: ${info.response}`))
            .catch(err => console.log(`Problem sending email: ${err}`))
    );
};

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

exports.userSignupValidator = (req, res, next) => {
    req.check("name", "Name is required").notEmpty();
    req.check("email", "Email must be between 4 to 2000 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 4,
            max: 2000
        });
    req.check("password", "Password is required")
        .notEmpty()
        .isLength({
            min: 6
        })
        .withMessage("Password must contains at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");

    const errors = req.validationErrors();
    if (errors) {
        const error = errors.map(error => error.msg)[0];
        return res.status(400).json({ error })
    }
    next();
}

exports.passwordResetValidator = (req, res, next) => {
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};