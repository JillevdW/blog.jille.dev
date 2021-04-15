import Alert from './alert'
import Footer from './footer'
import Meta from './meta'

type Props = {
  preview?: boolean
  children: React.ReactNode
}

const Layout = ({ preview, children }: Props) => {
  return (
    <>
      <div className="dark:bg-black dark:text-gray-100">
        <Meta />
        <div className="min-h-screen">
          <Alert preview={preview} />
          <main>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
