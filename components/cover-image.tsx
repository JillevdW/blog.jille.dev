import cn from 'classnames'
import Link from 'next/link'

type Props = {
  title: string
  src: string
  darkSrc: string
  slug?: string
}

const CoverImage = ({ title, src, darkSrc, slug }: Props) => {
  const image = (
    <div className={cn('shadow-small', {
      'hover:shadow-medium transition-shadow duration-200': slug,
    })}>
      <picture>
        <source srcSet={darkSrc} media={"(prefers-color-scheme: dark)"}></source>
        <img src={src} alt={`Cover Image for ${title}`}/>
      </picture>
    </div>
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default CoverImage
