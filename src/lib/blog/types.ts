export interface BlogFrontmatter {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  draft: boolean;
  seoTitle: string;
  seoDescription: string;
  coverImage: string;
  author: string;
  tags: string[];
}

export interface BlogPost extends BlogFrontmatter {
  body: string;
  readingTimeMinutes: number;
}
