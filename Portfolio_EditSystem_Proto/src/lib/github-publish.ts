import slugify from "slugify";
import { githubSettings } from "./github";
import { getInstallationToken } from "./github-token";
import { NewsItem, Language } from "../types/content";
import { tiptapJSONToHTML, htmlToMarkdown } from "../utils/convert";

export interface PublishNewsResult {
  item: NewsItem;
  slug: string;
  branch: string;
  prUrl: string;
  filePath: string;
}

interface GitHubRefResponse {
  object: { sha: string };
}

interface GitHubContentResponse {
  sha: string;
}

interface GitHubFileResponse {
  content: { path: string };
}

interface GitHubPrResponse {
  html_url: string;
}

class PublishError extends Error {
  constructor(message: string, public status?: number, public details?: unknown) {
    super(message);
    this.name = "PublishError";
  }
}

const SUPPORTED_LANGUAGES: Language[] = ["ja", "en"];

function sanitizeSlug(input: string): string {
  const trimmed = input.trim();
  const base = slugify(trimmed, {
    lower: true,
    strict: true,
    locale: "en",
  });
  return base || `news-${Date.now().toString(36)}`;
}

function ensureSlug(item: NewsItem): string {
  const current = item.slug?.trim();
  if (current) {
    return sanitizeSlug(current);
  }
  const jaTitle = item.title.ja?.trim();
  if (jaTitle) {
    return sanitizeSlug(jaTitle);
  }
  const enTitle = item.title.en?.trim();
  if (enTitle) {
    return sanitizeSlug(enTitle);
  }
  return sanitizeSlug(item.id);
}

function toMarkdown(docString?: string): string {
  if (!docString) {
    return "";
  }
  try {
    const doc = JSON.parse(docString);
    const html = tiptapJSONToHTML(doc);
    return htmlToMarkdown(html).trim();
  } catch (_) {
    return docString.trim();
  }
}

function encodeToBase64(content: string): string {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(unescape(encodeURIComponent(content)));
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(content, "utf-8").toString("base64");
  }
  throw new PublishError("Base64 encoding is not available in this environment");
}

async function githubRequest<T>(token: string, path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  let parsed: any = undefined;
  const hasBody = response.status !== 204;
  if (hasBody) {
    const text = await response.text();
    parsed = text ? JSON.parse(text) : undefined;
  }

  if (!response.ok) {
    const message = parsed?.message || `GitHub request failed (${response.status})`;
    throw new PublishError(message, response.status, parsed);
  }

  return parsed as T;
}

function buildNewsPayload(item: NewsItem, slug: string, markdownByLang: Record<Language, string>) {
  const date = item.date || new Date().toISOString().split("T")[0];
  const publishMap = item.publish ?? { ja: true, en: true };

  return {
    id: item.id,
    slug,
    date,
    tags: item.tags ?? [],
    image: item.image ?? "",
    pinned: item.pinned ?? false,
    status: item.published ? "published" : "draft",
    published: item.published,
    publish: publishMap,
    alt: item.alt,
    ogTitle: item.ogTitle,
    ogDescription: item.ogDescription,
    content: SUPPORTED_LANGUAGES.reduce((acc, lang) => {
      acc[lang] = {
        title: item.title[lang] ?? "",
        summary: item.summary[lang] ?? "",
        body: markdownByLang[lang] ?? "",
        alt: item.alt?.[lang] ?? "",
        ogTitle: item.ogTitle?.[lang] ?? "",
        ogDescription: item.ogDescription?.[lang] ?? "",
      };
      return acc;
    }, {} as Record<Language, Record<string, string>>),
  };
}

export async function publishNewsItem(item: NewsItem): Promise<PublishNewsResult> {
  let token: string;
  try {
    token = await getInstallationToken();
  } catch (error) {
    const message = error instanceof Error ? error.message : "GitHub installation token could not be resolved";
    throw new PublishError(message);
  }

  const slug = ensureSlug(item);
  const date = item.date || new Date().toISOString().split("T")[0];
  const filePath = `content/news/${date}-${slug}.json`;
  const encodedPath = encodeURI(filePath);

  const markdownByLang: Record<Language, string> = {
    ja: toMarkdown(item.body.ja),
    en: toMarkdown(item.body.en),
  } as Record<Language, string>;

  const payload = buildNewsPayload(
    {
      ...item,
      slug,
      date,
      publish: { ja: true, en: true },
      title: { ...item.title },
      summary: { ...item.summary },
      body: { ...item.body },
      alt: { ...item.alt },
      ogTitle: item.ogTitle ? { ...item.ogTitle } : undefined,
      ogDescription: item.ogDescription ? { ...item.ogDescription } : undefined,
      tags: [...(item.tags ?? [])],
    },
    slug,
    markdownByLang,
  );

  const branchSafeSlug = (slug || "news").replace(/[^a-z0-9-]/g, "");
  const branchName = `edit/news/${branchSafeSlug || "news"}-${Date.now().toString(36)}`;

  const baseRef = await githubRequest<GitHubRefResponse>(
    token,
    `/repos/${githubSettings.owner}/${githubSettings.repo}/git/ref/heads/${githubSettings.defaultBranch}`,
    { method: "GET" },
  );

  await githubRequest(
    token,
    `/repos/${githubSettings.owner}/${githubSettings.repo}/git/refs`,
    {
      method: "POST",
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: baseRef.object.sha,
      }),
    },
  );

  let existingSha: string | undefined;
  try {
    const existing = await githubRequest<GitHubContentResponse>(
      token,
      `/repos/${githubSettings.owner}/${githubSettings.repo}/contents/${encodedPath}?ref=${githubSettings.defaultBranch}`,
      { method: "GET" },
    );
    existingSha = existing.sha;
  } catch (error) {
    if (!(error instanceof PublishError && error.status === 404)) {
      throw error;
    }
  }

  const contentBase64 = encodeToBase64(`${JSON.stringify(payload, null, 2)}\n`);
  const commitMessage = item.published
    ? `chore: publish news ${slug}`
    : `chore: save news draft ${slug}`;

  const fileResponse = await githubRequest<GitHubFileResponse>(
    token,
    `/repos/${githubSettings.owner}/${githubSettings.repo}/contents/${encodedPath}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: commitMessage,
        content: contentBase64,
        branch: branchName,
        ...(existingSha ? { sha: existingSha } : {}),
      }),
    },
  );

  const primaryTitle = item.title.ja?.trim() || item.title.en?.trim() || slug;
  const prTitle = item.published
    ? `[News] ${primaryTitle} (${date})`
    : `[Draft] ${primaryTitle} (${date})`;

  const languageList = SUPPORTED_LANGUAGES.map(lang => lang.toUpperCase()).join(", ");
  const prBody = [
    "## Summary",
    `- Published via Edit Mode (${new Date().toISOString()})`,
    `- Languages: ${languageList}`,
    `- File: ${fileResponse.content.path}`,
  ].join("\n");

  const prResponse = await githubRequest<GitHubPrResponse>(
    token,
    `/repos/${githubSettings.owner}/${githubSettings.repo}/pulls`,
    {
      method: "POST",
      body: JSON.stringify({
        title: prTitle,
        head: branchName,
        base: githubSettings.defaultBranch,
        body: prBody,
        draft: !item.published,
      }),
    },
  );

  const updatedItem: NewsItem = {
    ...item,
    slug,
    date,
    publish: { ja: true, en: true },
  };

  return {
    item: updatedItem,
    slug,
    branch: branchName,
    prUrl: prResponse.html_url,
    filePath,
  };
}
