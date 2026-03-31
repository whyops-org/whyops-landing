import { env } from '@/lib/env';
import type {
  BlogPost,
  BlogPostDetailResponse,
  BlogPostsParams,
  BlogPostsResponse,
} from '@/lib/types/blog';

const HASHNODE_API_URL = 'https://gql.hashnode.com';

async function hashnodeQuery<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(HASHNODE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(env.hashnodePat ? { Authorization: env.hashnodePat } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Hashnode API error: ${response.status}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}

const GET_PUBLICATION_POSTS = `
  query GetPublicationPosts($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      posts(first: $first, after: $after) {
        totalDocuments
        edges {
          node {
            id slug title brief url
            coverImage { url isPortrait attribution }
            publishedAt readTimeInMinutes views
            author { name username profilePicture }
            tags { name slug }
            seo { title description }
            ogMetaData { image }
            reactionCount responseCount
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

const GET_POST_BY_SLUG = `
  query GetPostBySlug($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        id slug title subtitle brief url
        coverImage { url isPortrait attribution }
        content { markdown html }
        publishedAt readTimeInMinutes views
        author { name username profilePicture bio { text } }
        tags { name slug }
        seo { title description }
        ogMetaData { image }
        reactionCount responseCount
      }
    }
  }
`;

const GET_POST_METADATA = `
  query GetPostMetadata($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        id title brief publishedAt
        author { name }
        tags { name slug }
        coverImage { url }
        seo { title description }
        ogMetaData { image }
      }
    }
  }
`;

const GET_POSTS_FOR_SITEMAP = `
  query GetPostsForSitemap($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      posts(first: $first, after: $after) {
        edges { node { id slug publishedAt } }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

export async function fetchBlogPosts(
  host: string,
  params: BlogPostsParams = { first: 10 },
): Promise<BlogPostsResponse> {
  return hashnodeQuery<BlogPostsResponse>(GET_PUBLICATION_POSTS, {
    host,
    first: params.first ?? 10,
    after: params.after ?? null,
  });
}

export async function fetchBlogPostsForPage(
  host: string,
  page: number = 1,
  postsPerPage: number = 9,
): Promise<{
  posts: BlogPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  const postsToFetch = page * postsPerPage;
  const response = await fetchBlogPosts(host, { first: postsToFetch });
  const allPosts = response.publication.posts.edges.map((e) => e.node);
  const totalPosts = response.publication.posts.totalDocuments ?? allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const startIndex = (page - 1) * postsPerPage;
  const posts = allPosts.slice(startIndex, startIndex + postsPerPage);

  return {
    posts,
    totalPosts,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export async function fetchBlogPostBySlug(
  host: string,
  slug: string,
): Promise<BlogPostDetailResponse> {
  return hashnodeQuery<BlogPostDetailResponse>(GET_POST_BY_SLUG, { host, slug });
}

export async function fetchBlogPostMetadata(
  host: string,
  slug: string,
): Promise<BlogPostDetailResponse> {
  return hashnodeQuery<BlogPostDetailResponse>(GET_POST_METADATA, { host, slug });
}

export async function fetchBlogPostsForSitemap(
  host: string,
  params: BlogPostsParams = { first: 50 },
): Promise<BlogPostsResponse> {
  return hashnodeQuery<BlogPostsResponse>(GET_POSTS_FOR_SITEMAP, {
    host,
    first: params.first ?? 50,
    after: params.after ?? null,
  });
}
