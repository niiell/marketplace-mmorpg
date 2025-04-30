import { allPages } from '../../../../.contentlayer/generated'
import { notFound } from 'next/navigation'

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

  return (
    <article className="prose max-w-none mx-auto p-4">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.body.html }} />
    </article>
  )
}
