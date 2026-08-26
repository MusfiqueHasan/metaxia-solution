import Link from 'next/link';
import type { Post } from '@metaxia/shared';
import { Container } from '@/components/container';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/motion/reveal';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/**
 * Editorial index rows, not cards: date and category read like a ledger,
 * the title carries the weight, the arrow answers the hover.
 */
export function BlogPreview({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-line bg-ink py-28 lg:py-36">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Writing" title="Notes from the build." />
          <Reveal>
            <Link
              href="/blog"
              className="link-rule reveal-fade font-mono text-[11px] uppercase tracking-[0.25em] text-fg-soft transition-colors hover:text-fg"
            >
              All posts →
            </Link>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <ul>
            {posts.map((post, index) => (
              <li
                key={post.id}
                className="reveal-rise border-b border-line first:border-t"
                style={{ ['--reveal-delay' as string]: `${index * 0.08}s` }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid gap-2 py-8 sm:grid-cols-[11rem_1fr_auto] sm:items-baseline sm:gap-8"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-fg-soft">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    <span className="mt-1 block text-accent">{post.category}</span>
                  </span>
                  <span>
                    <span className="font-display text-2xl font-medium leading-snug tracking-tight text-fg transition-colors duration-300 group-hover:text-accent-strong sm:text-3xl">
                      {post.title}
                    </span>
                    <span className="mt-2 line-clamp-2 block max-w-xl text-sm leading-relaxed text-fg-soft">
                      {post.excerpt}
                    </span>
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="hidden h-5 w-5 self-center text-fg-soft transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent sm:block"
                  >
                    <path
                      d="M2 8h11M9 3.5 13.5 8 9 12.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
