import axios from "axios";

const BASE_URL = "https://api.github.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/vnd.github.v3+json",
    ...(import.meta.env.VITE_GITHUB_TOKEN
      ? { Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}` }
      : {}),
  },
});

// Types for GitHub API responses
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export interface CommitActivity {
  week: number;
  total: number;
  days: number[];
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  merged_at: string | null;
  created_at: string;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  created_at: string;
  closed_at: string | null;
}

/**
 * Fetch user profile data
 */
export async function fetchUser(username: string): Promise<GitHubUser> {
  const response = await api.get<GitHubUser>(`/users/${username}`);
  return response.data;
}

/**
 * Fetch repositories for a user
 */
export async function fetchUserRepos(
  username: string,
  sort: "updated" | "stars" = "updated",
  perPage: number = 30,
): Promise<GitHubRepo[]> {
  const response = await api.get<GitHubRepo[]>(`/users/${username}/repos`, {
    params: {
      sort,
      per_page: perPage,
      type: "owner",
    },
  });
  return response.data;
}

/**
 * Fetch a single repository
 */
export async function fetchRepo(
  owner: string,
  repo: string,
): Promise<GitHubRepo> {
  const response = await api.get<GitHubRepo>(`/repos/${owner}/${repo}`);
  return response.data;
}

/**
 * Fetch contributors for a repository
 */
export async function fetchContributors(
  owner: string,
  repo: string,
  perPage: number = 10,
): Promise<Contributor[]> {
  const response = await api.get<Contributor[]>(
    `/repos/${owner}/${repo}/contributors`,
    {
      params: { per_page: perPage },
    },
  );
  return response.data;
}

/**
 * Fetch commit activity for the last year (weekly breakdown)
 */
export async function fetchCommitActivity(
  owner: string,
  repo: string,
): Promise<CommitActivity[]> {
  try {
    const response = await api.get<CommitActivity[]>(
      `/repos/${owner}/${repo}/stats/commit_activity`,
    );
    return response.data || [];
  } catch (error) {
    // GitHub may return 202 while computing stats
    console.warn("Commit activity not ready yet");
    return [];
  }
}

/**
 * Fetch pull requests for a repository
 */
export async function fetchPullRequests(
  owner: string,
  repo: string,
  state: "all" | "open" | "closed" = "all",
  perPage: number = 100,
): Promise<PullRequest[]> {
  const response = await api.get<PullRequest[]>(
    `/repos/${owner}/${repo}/pulls`,
    {
      params: { state, per_page: perPage },
    },
  );
  return response.data;
}

/**
 * Fetch issues for a repository
 */
export async function fetchIssues(
  owner: string,
  repo: string,
  state: "all" | "open" | "closed" = "all",
  perPage: number = 100,
): Promise<Issue[]> {
  const response = await api.get<Issue[]>(`/repos/${owner}/${repo}/issues`, {
    params: { state, per_page: perPage },
  });
  // Filter out pull requests (they appear in issues endpoint too)
  return response.data.filter((issue: any) => !issue.pull_request);
}

/**
 * Search for repositories
 */
export async function searchRepos(
  query: string,
  perPage: number = 10,
): Promise<GitHubRepo[]> {
  const response = await api.get<{ items: GitHubRepo[] }>(
    "/search/repositories",
    {
      params: {
        q: query,
        per_page: perPage,
        sort: "stars",
      },
    },
  );
  return response.data.items;
}
