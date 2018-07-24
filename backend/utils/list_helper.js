const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, cur) => sum + cur
  return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const findMax = (x) => {
    return x === Math.max(...blogs.map(blog => blog.likes))
  }
  const findMaxIndex = () => blogs.map(blog => blog.likes).findIndex(findMax)
  const i = findMaxIndex()
  return {
    title: i === -1 ? undefined : blogs[i].title,
    author: i === -1 ? undefined : blogs[i].author,
    likes: i === -1 ? undefined : blogs[i].likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}