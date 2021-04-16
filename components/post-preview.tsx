import Avatar from './avatar'
import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import Link from 'next/link'
import Author from '../types/author'
import Tags from './tags'

type Props = {
  title: string
  coverImage: string
  darkCoverImage: string
  tags: [string]
  date: string
  excerpt?: string
  author?: Author
  slug: string
}

const PostPreview = ({
  title,
  coverImage,
  darkCoverImage,
  tags,
  date,
  excerpt,
  author,
  slug,
}: Props) => {
  return (
    <div>
      <div className="mb-5">
        <CoverImage slug={slug} title={title} src={coverImage} darkSrc={darkCoverImage}/>
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a className="hover:underline">{title}</a>
        </Link>
      </h3>
      <Tags tags={tags} className="mb-4"/>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      {
        excerpt 
          ? <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
          : ''
      }
      {/* {
        author
          ? <Avatar name={author.name} picture={author.picture} />
          : ''
      } */}
      
    </div>
  )
}

export default PostPreview
