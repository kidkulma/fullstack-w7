const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const { app, server } = require('../index')
const api = supertest(app)
const { initialBlogs, blogsInDb, usersInDb } = require('./test_helper')


describe('when there\' initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('all blogs are returned as JSON by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)
    const returnedTitles = response.body.map(n => n.title)
    blogsInDatabase.forEach(blog => {
      expect(returnedTitles).toContain(blog.title)
    })
  })

  describe('addition of a new blog (POST /api/blogs)', () => {
    test('a valid blog can be added', async () => {
      const blogsAtStart = await blogsInDb()
      const newBlog = {
        'title': 'Testi-blogi2',
        'author': 'Kimmo K',
        'url': 'localhost:3003',
        'likes': 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      const titles = blogsAfterOperation.map(b => b.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
      expect(titles).toContainEqual(newBlog.title)
    })

    test('a proper error code is given when url or title is undefined or \'\'', async () => {
      const blogsAtStart = await blogsInDb()
      const newBlog1 = {
        'title': 'Testi-blogi3',
        'author': 'Kimmo K'
      }
      const newBlog2 = {
        'author': 'Kimmo K',
        'url': 'localhost:3003'
      }
      const newBlog3 = {
        'title': '',
        'url': 'localhost:3003'
      }
      const newBlog4 = {
        'title': 'Testi-blogi4',
        'url': ''
      }

      await api
        .post('/api/blogs')
        .send(newBlog1)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      await api
        .post('/api/blogs')
        .send(newBlog2)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      await api
        .post('/api/blogs')
        .send(newBlog3)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      await api
        .post('/api/blogs')
        .send(newBlog4)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })

    test('a blog with undefined likes gets 0 likes as a default', async () => {
      const blogsAtStart = await blogsInDb()
      const newBlog = {
        'title': 'Testi-blogi3',
        'author': 'Kimmo K',
        'url': 'localhost:3003'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      const titlesAfterOperation = blogsAfterOperation.map(b => b.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
      expect(titlesAfterOperation).toContainEqual(newBlog.title)
      expect(blogsAfterOperation[blogsAfterOperation.length - 1].likes).toBe(0)
    })
  })
})

describe.only('when there is initially one user at db', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
    const usernames = usersAfterOperation.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'username must be unique' })

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })


  test('POST /api/users fails with proper statuscode and message if password is too short', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'rootti',
      name: 'Superuser',
      password: 'sa'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'password must be at least 3 characters long' })

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })
})

afterAll(() => {
  server.close()
})