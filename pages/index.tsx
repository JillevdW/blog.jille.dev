import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'
import Post from '../types/post'

type Props = {
  allPosts: Post[],
  titleAccentColor: string
}

const Index = ({ allPosts, titleAccentColor }: Props) => {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Layout>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          <Intro className={titleAccentColor}/>
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              tags={heroPost.tags}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

export default Index

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'tags',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])
  
  const classNames = ['text-blue-600', 'text-yellow-400', 'text-purple-600', 'text-green-400'];
  const titleAccentColor = classNames[getRandomInt(0, classNames.length)];

  return {
    props: { 
      allPosts,
      titleAccentColor
    },
  }
}
