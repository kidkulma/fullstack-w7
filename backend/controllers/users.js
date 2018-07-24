const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', { likes: 1, author: 1, url: 1, title: 1 })
  res.json(users.map(User.format))
})

usersRouter.post('/', async (req, res) => {
  try {
    const body = req.body

    const existingUser = await User.find({ username: body.username })
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'username must be unique' })
    } else if (body.password.length < 3) {
      return res.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      aikuinen: body.aikuinen === undefined ? true : body.aikuinen
    })

    const savedUser = await user.save()

    res.json(User.format(savedUser))
  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter