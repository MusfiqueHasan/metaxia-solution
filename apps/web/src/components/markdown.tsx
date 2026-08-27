export function Markdown({ body }: { body: string }) {
  // Rich-text admin content arrives as HTML (CKEditor); trusted authors only.
  if (body.trimStart().startsWith('<')) {
    return (
      <div
        className="space-y-5 leading-[1.85] text-fg-soft [&_a]:text-accent [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:italic [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:tracking-[-0.01em] [&_h2]:text-fg [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-fg [&_li]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:text-fg [&_table]:w-full [&_td]:border [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }

  return (
    <div className="space-y-5">
      {body.split(/\n\n+/).map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="mt-12 font-display text-2xl tracking-[-0.01em] text-fg">
              {block.slice(3)}
            </h2>
          );
        }
        const lines = block.split('\n');
        if (lines.every((line) => line.startsWith('- '))) {
          return (
            <ul key={i} className="space-y-3">
              {lines.map((line, j) => (
                <li key={j} className="flex items-start gap-3 text-[1.0625rem] leading-[1.7] text-fg-soft">
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent"
                  />
                  {line.slice(2)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[1.0625rem] leading-[1.85] text-fg-soft">
            {block}
          </p>
        );
      })}
    </div>
  );
}
