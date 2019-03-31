const { sanitizeBody } = require('express-validator/filter');
const { body } = require('express-validator/check');

module.exports = (
    [    
    body('email')
    .isEmail()
    .normalizeEmail(),

    body('user_id')
    .not().isEmpty().withMessage('This field cannot be empty')
    .trim()
    .escape(),
    sanitizeBody('notifyOnReply').toBoolean(),

    // password must contain 8 characters and at least a number
    body('password')
    .isLength({min: 8})
    .withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number'),

    // checking if passwordConfirmation matches password
    // body('confirm_password')
    // .custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //       throw new Error('Password confirmation does not match password');
    //     }
    //   })
    ]
)