export interface TiptapMarkdownStorage {
  getMarkdown?: () => string | undefined;
}

export const getMarkdownFromStorage = (storage: unknown): string | undefined => {
  if (!storage || typeof storage !== 'object') {
    return undefined;
  }

  const markdownStorage = (storage as { markdown?: TiptapMarkdownStorage }).markdown;

  if (markdownStorage && typeof markdownStorage.getMarkdown === 'function') {
    return markdownStorage.getMarkdown();
  }

  return undefined;
};
