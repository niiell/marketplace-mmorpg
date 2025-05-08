import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

const contentDirectory = path.join(process.cwd(), 'content/pages')

export async function generateStaticParams() {
  const filenames = await fs.readdir(contentDirectory)
  return filenames.map((filename) => ({
    slug: filename.replace(/\.mdx?$/, ''),
  }))
}

export default async function Page(props: any) {
  const slug = props.params.slug
  const fullPath = path.join(contentDirectory, `${slug}.mdx`)

  try {
    const fileContents = await fs.readFile(fullPath, 'utf8')
    const { content, data } = matter(fileContents)
    const mdxSource = await serialize(content)

    return (
      <article className="prose max-w-none mx-auto p-4">
        <h1>{data.title || slug}</h1>
        <MDXRemote source={mdxSource} />
      </article>
    )
  } catch (error) {
    if (error.code === 'ENOENT') {
      notFound()
    } else {
      throw error
    }
  }
}