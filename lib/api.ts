import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import PostType from '../types/post'
import { Tag } from '../types/tag'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: any
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }
    if (field === 'tags') {
      items[field] = data[field].split(',');

      items[field].forEach((e: string) => {
        if (!Tag.exists(e)) { const arr: any = null; arr[0];}
        // If this crashes, there is a markdown file with an unsupported tag.
      });

      return;
    }

    if (data[field]) {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

export function getRelatedPosts(slug: string, tags: [string], fields: string[] = []) {
  return getAllPosts(fields)
    .filter((e) => { 
      return tags.some(tag => e.tags.includes(tag)) && slug !== e.slug 
    });
}
