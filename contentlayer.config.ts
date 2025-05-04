import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: `**/*.md`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
  },
  computedFields: {
    flattenedPath: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}))

export const DisputeGuideline = defineDocumentType(() => ({
  name: 'DisputeGuideline',
  filePathPattern: `dispute/guidelines/*.md`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
  },
  computedFields: {
    flattenedPath: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}))

export const FAQ = defineDocumentType(() => ({
  name: 'FAQ',
  filePathPattern: `faq/*.md`,
  contentType: 'mdx',
  fields: {
    question: { type: 'string', required: true },
    answer: { type: 'string', required: true },
  },
  computedFields: {
    flattenedPath: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Page, DisputeGuideline, FAQ],
  // pastikan generated path sesuai
  generateArtifacts: true,
  disableImportAliasWarning: true
})
