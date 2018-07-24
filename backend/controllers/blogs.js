const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  res.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined || body.title === '' || body.url === undefined || body.url === '') {
      return res.status(400).json({ error: 'Both title and url must be spesified' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      res.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      res.status(500).json({ error: 'something went wrong...' })
    }
  }
})

blogsRouter.delete('/:id', async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(req.params.id)
    const user = await User.findById(decodedToken.id)

    if (blog.user.toString() === user._id.toString() || blog.user.length === 0) {
      await Blog.findByIdAndRemove(req.params.id)
      res.status(204).end()
    } else {
      res.status(401).json({ error: 'you can only delete a blog you have posted yourself' })
    }
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      res.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      res.status(400).json({ error: 'malformatted id' })
    }
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body
  try {
    const blogInDb = await Blog.findById(req.params.id)

    const blog = {
      title: body.title === undefined ? blogInDb.title : body.title,
      author: body.author === undefined ? blogInDb.author : body.author,
      url: body.url === undefined ? blogInDb.url : body.url,
      likes: body.likes === undefined ? blogInDb.likes : body.likes
    }
    await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    res.status(200).end()
  } catch (exception) {
    console.log(exception)
    res.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter