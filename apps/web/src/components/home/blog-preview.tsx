import Link from 'next/link';
import type { Post } from '@metaxia/shared';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogPreview({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-surface-alt py-24 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Field Notes" title="Writing from the team" />

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-3xl border border-ink/10 p-8 transition-colors hover:border-accent/30 hover:bg-accent-soft"
            >
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                <span>{post.category}</span>
                <span className="h-1 w-1 rotate-45 bg-accent/50" aria-hidden="true" />
                <time dateTime={post.publishedAt} className="font-normal tracking-normal text-ink-soft">
                  {formatDate(post.publishedAt)}
                </time>
              </div>
              <h3 className="mt-4 font-display text-lg font-medium tracking-tight text-ink">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
              <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium text-accent">
                Read the post
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
