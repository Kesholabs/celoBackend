const {body} =  require('express-validator')

const registrationBody = () => {
    return [
        body('name')
        .exists()
        .withMessage('Name is required')
        .isLength({min:3})
        .withMessage('minimum length is 3 characters'),
        body('email')
        .exists()
        .withMessage('email is required ')
        .isEmail()
        .withMessage('Email should be valid')
    ]
}

module.exports = {
    registrationBody:registrationBody
}