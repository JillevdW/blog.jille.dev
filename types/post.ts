import Author from './author'

type PostType = {
  slug: string
  title: string
  tags: [string]
  date: string
  coverImage: string
  darkCoverImage: string
  author: Author
  excerpt: string
  ogImage: {
    url: string
  }
  content: string
}

export default PostType
