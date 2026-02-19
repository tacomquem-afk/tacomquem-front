import ReactMarkdown from "react-markdown";

type Props = { content: string };

export function LegalDocument({ content }: Props) {
  return (
    <article className="prose prose-invert prose-sm sm:prose-base max-w-none [&_table]:text-sm [&_th]:bg-muted/50 [&_th]:font-medium [&_td]:align-top [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_h2]:mt-10 [&_h2]:scroll-mt-4 [&_h3]:mt-6 [&_strong]:text-foreground [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline [&_hr]:border-border/50 [&_ul]:list-disc [&_li]:marker:text-muted-foreground">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
