interface BlogPostContentProps {
  html: string;
}

export function BlogPostContent({ html }: BlogPostContentProps) {
  return (
    <div
      className="whyops-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
