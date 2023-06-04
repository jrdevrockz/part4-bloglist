const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
}, 100000)

describe('get all', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog posts has unique identifier id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('addition of a new blog', () => {
  test('succeeds with vaild data', async () => {
    const newBlog = {
      author: 'Test Author',
      title: 'Test Title',
      url: 'http://test.url/',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'Test Title'
    )
  })

  test('a missing likes property will default to zero', async () => {
    const newBlog = {
      author: 'Test Author',
      title: 'Test Title',
      url: 'http://test.url/'
    }

    const resultBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    expect(resultBlog.body.likes).toBe(0)
  })

  test('fails with status code 400 if title or url data is missing', async () => {
    const newBlog = {
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToDelete = blogAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      blogAtStart.length - 1
    )

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating of a old blog', () => {
  test('succeeds with vaild data', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToUpdate = blogAtStart[0]

    const newBlog = {
      likes: 132
    }

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(updatedBlog.body.likes).toBe(132)
  })

  test('fails with status code 400 if title or url data is missing', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToUpdate = blogAtStart[0]

    const newBlog = {
      url: null,
      likes: 132
    }

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(400)

    expect(updatedBlog.body).not.toEqual(blogToUpdate)

    const blogsAtEnd = await helper.blogsInDb()
    const newUpdatedBlog = blogsAtEnd[0]

    expect(blogToUpdate).toEqual(newUpdatedBlog)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})