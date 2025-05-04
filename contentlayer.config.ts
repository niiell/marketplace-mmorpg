import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.md`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
  },
}));

export const DisputeGuideline = defineDocumentType(() => ({
  name: "DisputeGuideline",
  filePathPattern: `dispute/guidelines/**/*.md`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    content: { type: "string", required: true },
  },
}));

export const FAQ = defineDocumentType(() => ({
  name: "FAQ",
  filePathPattern: `faq/**/*.md`,
  contentType: "mdx",
  fields: {
    question: { type: "string", required: true },
    answer: { type: "string", required: true },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Page, DisputeGuideline, FAQ],
  disableImportAliasWarning: true,
});