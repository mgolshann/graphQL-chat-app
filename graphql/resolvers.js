const bcrypt = require('bcryptjs')
const { UserInputError } = require('apollo-server')

const { User } = require('../models');
module.exports = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.findAll()
                return users
            } catch (err) {
                console.log(err)
            }
        },
    },
    Mutation: {
        register: async (_, args) => {
            let { username, email, password, confirmPassword } = args
            let errors = {}
            try {
                // Validate input data
                if (username.trim() === '') errors.username = 'username must not be empty'
                if (email.trim() === '') errors.email = 'email must not be empty'
                if (password.trim() === '') errors.password = 'password must not be empty'
                if (confirmPassword.trim() === '') errors.confirmPassword = 'confirmPassword must not be empty'
                if (password !== confirmPassword) errors.confirmPassword = 'passwords must be match'

                /* 
                There is no need to validate data like that when you
                have sequelize validator
                
                // check if username  / email exists
                // const userByUsername = await User.findOne({ where: { username } })
                // const emailByEmail = await User.findOne({ where: { email } })
                // if (userByUsername) errors.username = 'username is already taken'
                // if (emailByEmail) errors.email = 'email is already taken'
                */

                if (Object.keys(errors).length > 0) {
                    throw errors
                }
                // hash password 
                password = await bcrypt.hash(password, 6)

                // create user
                const user = await User.create({
                    username, email, password
                })
                // return user
                return user
            } catch (err) {
                console.log(err)
                if (err.name === "SequelizeUniqueConstraintError") {
                    err.errors.forEach((e) => (errors[e.path] = `${e.path} is already taken`))
                }
                if (err.name === "SequelizeValidationError") {
                    err.errors.forEach((e) => errors[e.path] = e.message)
                }
                throw new UserInputError('Bad Input', { errors })
            }
        }
    }
};