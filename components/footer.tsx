import Container from './container'
import { EXAMPLE_PATH } from '../lib/constants'

const Footer = () => {
  return (
    <footer className="bg-accent-1  dark:bg-black border-t border-accent-2 dark:border-gray-800">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <h3 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            Written by <a className="text-blue-400 hover:underline" href="https://bsky.app/profile/jille.dev">Jille</a>.
          </h3>
          {/* <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            <a
              href="https://nextjs.org/docs/basic-features/pages"
              className="mx-3 bg-black dark:bg-white hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white border border-black dark:border-white text-white dark:text-black font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
            >
              Read Documentation
            </a>
            <a
              href={`https://github.com/vercel/next.js/tree/canary/examples/${EXAMPLE_PATH}`}
              className="mx-3 font-bold hover:underline"
            >
              View on GitHub
            </a>
          </div> */}
        </div>
      </Container>
    </footer>
  )
}

export default Footer
