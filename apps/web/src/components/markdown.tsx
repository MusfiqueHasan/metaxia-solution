export function Markdown({ body }: { body: string }) {
  return (
    <div className="space-y-5">
      {body.split(/\n\n+/).map((block, i) =>
        block.startsWith('## ') ? (
          <h2 key={i} className="mt-12 font-display text-2xl font-medium tracking-tight text-fg">
            {block.slice(3)}
          </h2>
        ) : (
          <p key={i} className="text-[1.0625rem] leading-[1.85] text-fg-soft">
            {block}
          </p>
        ),
      )}
    </div>
  );
}
