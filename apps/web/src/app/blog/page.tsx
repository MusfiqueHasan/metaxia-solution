import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on shipping software, from the engineers and strategists at Metaxia Solutions.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog',
    description: 'Notes on shipping software, from the engineers and strategists at Metaxia Solutions.',
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPage() {
  const posts = (await getPosts()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <main>
      <PageHero
        eyebrow="Field Notes"
        title="Writing from the team."
        lede="Practical notes on the systems we build, the vendors we evaluate, and the decisions that come up on every engagement."
      />

      <section className="bg-ink py-24 lg:py-28">
        <Container>
          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-3xl border border-line bg-ink-raised p-8 transition-colors hover:border-accent/30 hover:bg-accent-soft"
                >
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-accent-soft px-3 py-1 font-semibold uppercase tracking-wide text-accent">
                      {post.category}
                    </span>
                    <time
                      dateTime={post.publishedAt}
                      className="font-normal tracking-normal text-fg-soft"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                  <h2 className="mt-4 font-display text-lg font-medium tracking-tight text-fg">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-fg-soft">{post.excerpt}</p>
                  <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium text-accent">
                    Read the post
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-fg-soft">Posts are temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
