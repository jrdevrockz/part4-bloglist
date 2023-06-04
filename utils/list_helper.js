const dummy = () => {
  return 1
}

const totalLikes = (blog) => {
  const reducer = (sum, post) => {
    return sum + post.likes
  }

  return blog.length === 0
    ? 0
    : blog.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (mostVoted, blog) => {
    return mostVoted.likes > blog.likes
      ? mostVoted
      : { title: blog.title, author: blog.author, likes: blog.likes }
  }

  return blogs.length === 0
    ? {}
    : blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
  let authors = []

  blogs.forEach((blog) => {
    let author = authors.find(a => a.author === blog.author)

    if (!author) {
      author = {
        author: blog.author,
        blogs: 0
      }
    }

    author.blogs += 1

    authors = authors.concat(author)
  })

  const reducer = (mostAuthor, author) => {
    return mostAuthor.blogs > author.blogs
      ? mostAuthor
      : author
  }

  return blogs.length === 0
    ? {}
    : authors.reduce(reducer, 0)
}

const mostLikes = (blogs) => {
  let authors = []

  blogs.forEach((blog) => {
    let author = authors.find(a => a.author === blog.author)

    if (!author) {
      author = {
        author: blog.author,
        likes: 0
      }
    }

    author.likes += blog.likes

    authors = authors.concat(author)
  })

  const reducer = (mostAuthor, author) => {
    return mostAuthor.likes > author.likes
      ? mostAuthor
      : author
  }

  return blogs.length === 0
    ? {}
    : authors.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}