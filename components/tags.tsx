import Link from "next/link"
import { Tag } from "../types/tag"

type Props = {
  tags: [string],
  className?: string
}

const Tags = ({ tags, className }: Props) => {
  return (
    <div className={`flex justify-start items-center ${className}`}>
      {tags.map(tag => (
        <Link as={`/tags/${tag}`} href="/tags/[tag]">
          <span className={`text-gray-100 dark:text-white bg-${Tag.color(tag)} rounded py-1 px-3 mr-3 font-bold cursor-pointer`} key={tag}>{tag}</span>
        </Link>
        
      ))}
    </div>
  )
}

export default Tags
