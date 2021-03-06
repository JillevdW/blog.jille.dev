import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getRelatedPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import PostType from '../../types/post'
import RelatedPosts from '../../components/related-posts'
import * as TagType from "../../types/tag"
import { getRandomColorClassName } from '../../lib/randomColor'

type Props = {
  posts: PostType[],
  tag: string,
  headerColor: string
}

const Tag = ({ posts, tag, headerColor}: Props) => {
  const router = useRouter()
  if (!router.isFallback && !tag) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout>
      <Container>
        <Header headerColor={headerColor}/>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {tag} | A Swift Blog
                </title>
              </Head>
              <section className="flex items-center justify-start mt-8 mb-12">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight">
                  More about <span className={TagType.Tag.textColor(tag)}>{tag}</span>.
                </h1>
              </section>
            </article>

            { posts.length > 0
              ? <RelatedPosts posts={posts} showsTitle={false}/>
              : ''
            }
          </>
        )}
      </Container>
    </Layout>
  )
}

export default Tag

type Params = {
  params: {
    tag: string
  }
}

export async function getStaticProps({ params }: Params) {
  const posts = getRelatedPosts('', [params.tag], [
    'title',
    'date',
    'tags',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
    'darkCoverImage'
  ])

  return {
    props: {
      posts,
      tag: params.tag,
      headerColor: getRandomColorClassName()
    },
  }
}

export async function getStaticPaths() {
  return {
    paths: TagType.Tag.allTags().map((tag) => {
      return {
        params: {
          tag,
        },
      }
    }),
    fallback: false,
  }
}
