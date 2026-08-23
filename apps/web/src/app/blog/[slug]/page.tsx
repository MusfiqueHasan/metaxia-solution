import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/api';
import { Container } from '@/components/container';
import { Markdown } from '@/components/markdown';
import { ContactCta } from '@/components/home/contact-cta';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = true;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allPosts = await getPosts();
  const post = allPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const morePosts = allPosts.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <main>
      <section className="grid-signature relative overflow-hidden bg-ink text-white">
        <Container className="pt-24 pb-20 lg:pt-28 lg:pb-24">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            <span>{post.category}</span>
            <span className="h-1 w-1 rotate-45 bg-accent/50" aria-hidden="true" />
            <time dateTime={post.publishedAt} className="font-normal tracking-normal text-white/60">
              {formatDate(post.publishedAt)}
            </time>
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
        </Container>
      </section>

      <section className="bg-surface py-24 lg:py-28">
        <Container>
          <div className="max-w-3xl">
            <Markdown body={post.body} />
          </div>
        </Container>
      </section>

      {morePosts.length > 0 ? (
        <section className="bg-surface-alt py-24 lg:py-28">
          <Container>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden="true" />
              More From the Blog
            </div>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Keep reading
            </h2>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {morePosts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex flex-col rounded-3xl border border-ink/10 bg-surface p-8 transition-colors hover:border-accent/30 hover:bg-accent-soft"
                >
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                    <span>{item.category}</span>
                    <span className="h-1 w-1 rotate-45 bg-accent/50" aria-hidden="true" />
                    <time dateTime={item.publishedAt} className="font-normal tracking-normal text-ink-soft">
                      {formatDate(item.publishedAt)}
                    </time>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-medium tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.excerpt}</p>
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
      ) : null}

      <ContactCta />
    </main>
  );
}
