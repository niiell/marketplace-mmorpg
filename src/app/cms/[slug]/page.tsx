import { allPages } from '../../../../.contentlayer/generated'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { serialize } from 'next-mdx-remote/serialize'

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page._raw.flattenedPath,
  }))
}

export default async function Page(props: any) {
  const slug = props.params.slug
  const page = allPages.find((page) => page._raw.flattenedPath === slug)

  if (!page) {
    notFound()
  }

  const mdxSource = await serialize(page.body.raw)

  return (
    <article className="prose max-w-none mx-auto p-4">
      <h1>{page.title}</h1>
      <MDXRemote source={mdxSource} />
    </article>
  )
}
