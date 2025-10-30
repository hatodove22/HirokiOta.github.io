interface InternalSettings {
  owner: string;
  repo: string;
  defaultBranch: string;
  tokenStorageKey?: string;
  tokenEndpoint?: string;
  tokenGlobalPath?: string;
}

function readEnv(name: string, fallback?: string) {
  const value = (import.meta.env as Record<string, string | undefined>)[name];
  const trimmed = (value ?? fallback ?? '').trim();
  return trimmed;
}

function normalizeOptional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function assertNonEmpty(value: string, key: string): string {
  if (!value) {
    throw new Error(`Missing required environment value for ${key}`);
  }
  return value;
}

export const githubSettings: InternalSettings = {
  owner: assertNonEmpty(readEnv('VITE_GITHUB_OWNER', 'yamaokayuki20'), 'VITE_GITHUB_OWNER'),
  repo: assertNonEmpty(readEnv('VITE_GITHUB_REPO', 'ota_portfolio'), 'VITE_GITHUB_REPO'),
  defaultBranch: assertNonEmpty(readEnv('VITE_GITHUB_DEFAULT_BRANCH', 'main'), 'VITE_GITHUB_DEFAULT_BRANCH'),
  tokenStorageKey: normalizeOptional(readEnv('VITE_GITHUB_TOKEN_STORAGE_KEY', 'ota.github.installationToken')),
  tokenEndpoint: normalizeOptional(readEnv('VITE_GITHUB_TOKEN_ENDPOINT', '')),
  tokenGlobalPath: normalizeOptional(readEnv('VITE_GITHUB_TOKEN_GLOBAL_PATH', '__OTA_AUTH__.githubInstallationToken')),
};

export type GitHubSettings = typeof githubSettings;
