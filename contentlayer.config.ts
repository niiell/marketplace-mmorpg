import { defineDocumentType, makeSource } from 'contentlayer/source-files';

// Contoh dokumen Blog
export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: `blog/*.md`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    description: { type: 'string', required: false },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog],
});
