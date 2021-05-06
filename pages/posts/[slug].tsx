import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import PostType from '../../types/post'
import RelatedPosts from '../../components/related-posts'
import { getRandomColorClassName } from '../../lib/randomColor'

type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean,
  headerColor: string
}

const Post = ({ post, morePosts, preview, headerColor }: Props) => {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header headerColor={headerColor}/>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | A Swift Blog
                </title>
                <meta property="og:image" content={post.ogImage.url} />
                <meta name='date' content={post.date}></meta>
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                darkCoverImage={post.darkCoverImage}
                tags={post.tags}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
            </article>

            {
              morePosts.length > 0
                ? <RelatedPosts posts={morePosts}/>
                : ''
            }
          </>
        )}
      </Container>
    </Layout>
  )
}

export default Post

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
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
  const content = await markdownToHtml(post.content || '')

  const morePosts = getRelatedPosts(post.slug, post.tags, [
    'title',
    'date',
    'tags',
    'slug',
    'coverImage',
    'darkCoverImage'
  ]);

  return {
    props: {
      post: {
        ...post,
        content,
      },
      morePosts,
      headerColor: getRandomColorClassName()
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug,
        },
      }
    }),
    fallback: false,
  }
}
