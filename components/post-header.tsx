import Avatar from './avatar'
import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import PostTitle from './post-title'
import Author from '../types/author'
import Tags from './tags'

type Props = {
  title: string
  coverImage: string
  darkCoverImage: string
  tags: [string]
  date: string
  author: Author
}

const PostHeader = ({ title, coverImage, darkCoverImage, tags, date, author }: Props) => {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <Tags tags={tags} className="mb-8"/>
      {/* <div className="hidden md:block md:mb-12">
        <Avatar name={author.name} picture={author.picture} />
      </div> */}
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage} darkSrc={darkCoverImage} />
      </div>
      <div className="max-w-2xl mx-auto">
        {/* <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.picture} />
        </div> */}
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </>
  )
}

export default PostHeader
