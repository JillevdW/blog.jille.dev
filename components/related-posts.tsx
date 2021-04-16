import PostPreview from './post-preview'
import Post from '../types/post'

type Props = {
  posts: Post[],
  showsTitle?: Boolean
}

const RelatedPosts = ({ posts, showsTitle = true }: Props) => {
  return (
    <section>
      { showsTitle 
        ? <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
            Related Posts
          </h2>
        : ''
      }
      
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            tags={post.tags}
            coverImage={post.coverImage}
            darkCoverImage={post.darkCoverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
