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
        <Link as={`/tags/${tag}`} href="/tags/[tag]" key={tag}>
          <span className={`text-gray-100 dark:text-white ${Tag.bgColor(tag)} rounded py-1 px-3 mr-3 font-bold cursor-pointer`}>{tag}</span>
        </Link>
        
      ))}
    </div>
  )
}

export default Tags
