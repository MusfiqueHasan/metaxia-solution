export function Markdown({ body }: { body: string }) {
  return (
    <div className="space-y-5">
      {body.split(/\n\n+/).map((block, i) =>
        block.startsWith('## ') ? (
          <h2 key={i} className="font-display text-2xl mt-10">
            {block.slice(3)}
          </h2>
        ) : (
          <p key={i} className="text-ink-soft leading-relaxed">
            {block}
          </p>
        ),
      )}
    </div>
  );
}
