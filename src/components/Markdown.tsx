type MarkdownProps = {
  content: string;
  className?: string;
};

export function Markdown({ content, className }: MarkdownProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
}
