import { githubSettings } from "./github";

function resolveGlobalToken(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const path = githubSettings.tokenGlobalPath;
  if (!path) {
    return undefined;
  }

  const segments = path.split(".").filter(Boolean);
  let current: any = window;

  for (const segment of segments) {
    if (segment === "window") {
      continue;
    }
    if (current && typeof current === "object" && segment in current) {
      current = current[segment];
    } else {
      return undefined;
    }
  }

  if (typeof current === "string" && current.trim().length > 0) {
    return current.trim();
  }

  return undefined;
}

function resolveStorageToken(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const key = githubSettings.tokenStorageKey;
  if (!key) {
    return undefined;
  }

  const read = (getValue: () => string | null) => {
    try {
      const value = getValue();
      return value && value.trim().length > 0 ? value.trim() : undefined;
    } catch (_) {
      return undefined;
    }
  };

  return (
    read(() => window.sessionStorage.getItem(key)) ||
    read(() => window.localStorage.getItem(key))
  );
}

async function fetchTokenFromEndpoint(): Promise<string | undefined> {
  const endpoint = githubSettings.tokenEndpoint;
  if (!endpoint) {
    return undefined;
  }

  const response = await fetch(endpoint, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub token (status ${response.status})`);
  }

  const data = await response.json();
  const token =
    (typeof data?.token === "string" && data.token.trim()) ||
    (typeof data?.installationToken === "string" && data.installationToken.trim()) ||
    (typeof data?.installation_token === "string" && data.installation_token.trim());

  if (!token) {
    throw new Error("Token endpoint response did not contain a token field");
  }

  return token;
}

export async function getInstallationToken(): Promise<string> {
  const fromGlobal = resolveGlobalToken();
  if (fromGlobal) {
    return fromGlobal;
  }

  const fromStorage = resolveStorageToken();
  if (fromStorage) {
    return fromStorage;
  }

  const fromEndpoint = await fetchTokenFromEndpoint();
  if (fromEndpoint) {
    return fromEndpoint;
  }

  throw new Error("GitHub installation token not found in current session");
}
