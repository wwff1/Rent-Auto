const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()


// /api/auth/register
router.post(
    '/register',
    [
        check('login', 'Некорректный email').exists(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный данные при регистрации'
                })
            }

            const {login, password} = req.body

            const candidate = await User.findOne({ login })

            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ login, password: hashedPassword })

            await user.save()

            res.status(201).json({ message: 'Пользователь создан' })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

// /api/auth/login
router.post(
    '/login',
    [
        check('login', 'Введите корректный email').exists(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный данные при входе в систему'
                })
            }

            const {login, password} = req.body

            const user = await User.findOne({ login })

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' })
            }



            if (password !== user.password){
                return res.status(400).json({message: 'Неверный пароль'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({ token, userId: user.id })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })


module.exports = router