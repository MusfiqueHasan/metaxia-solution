export function Markdown({ body }: { body: string }) {
  return (
    <div className="space-y-5">
      {body.split(/\n\n+/).map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="mt-12 font-display text-2xl font-medium tracking-tight text-fg">
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
