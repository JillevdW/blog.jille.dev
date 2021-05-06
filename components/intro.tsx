import { CMS_NAME } from '../lib/constants'

type Props = {
  className: string
}

const Intro = ({ className }: Props) => {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        A Swift <span className={className}>Blog</span>.
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        Articles about Swift, Laravel and other awesome technologies.
      </h4>
    </section>
  )
}

export default Intro
