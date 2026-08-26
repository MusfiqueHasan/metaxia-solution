import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/api';
import { site } from '@/lib/site';
import { Container } from '@/components/container';
import { Markdown } from '@/components/markdown';
import { ContactCta } from '@/components/home/contact-cta';
import { JsonLd } from '@/components/json-ld';
import { Starfield } from '@/components/motion/starfield';
import { SplitWords } from '@/components/motion/split-words';
import { Reveal } from '@/components/motion/reveal';

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) return { title: 'Not found' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: site.name,
    },
    url: `${site.url}/blog/${post.slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${site.url}/blog/${post.slug}` },
    ],
  };

  return (
    <main className="grain relative overflow-hidden bg-ink">
      <Starfield />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <section className="relative border-b border-line text-white">
        <Container className="pt-36 pb-20 lg:pt-44 lg:pb-24">
          <Reveal>
          <div className="reveal-fade flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
            <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
            <span>{post.category}</span>
            <span className="h-1 w-1 rotate-45 bg-accent/50" aria-hidden="true" />
            <time dateTime={post.publishedAt} className="text-fg-soft">
              {formatDate(post.publishedAt)}
            </time>
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.1] tracking-[-0.01em] sm:text-5xl lg:text-6xl">
            <SplitWords text={post.title} from={0.1} />
          </h1>
          </Reveal>
        </Container>
      </section>

      <section className="relative py-24 lg:py-28">
        <Container>
          <Reveal className="max-w-3xl">
            <div className="reveal-rise">
              <Markdown body={post.body} />
            </div>
          </Reveal>
        </Container>
      </section>

      {morePosts.length > 0 ? (
        <section className="relative border-t border-line py-24 lg:py-28">
          <Container>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="h-2 w-2 rotate-45 bg-accent" aria-hidden="true" />
              More From the Blog
            </div>
            <h2 className="mt-4 font-display text-3xl tracking-[-0.01em] text-fg sm:text-4xl">
              Keep reading
            </h2>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {morePosts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex flex-col rounded-3xl border border-line bg-ink p-8 transition-colors hover:border-accent/30 hover:bg-accent-soft"
                >
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                    <span>{item.category}</span>
                    <span className="h-1 w-1 rotate-45 bg-accent/50" aria-hidden="true" />
                    <time dateTime={item.publishedAt} className="font-normal tracking-normal text-fg-soft">
                      {formatDate(item.publishedAt)}
                    </time>
                  </div>
                  <h3 className="mt-4 font-display text-lg tracking-[-0.01em] text-fg">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-soft">{item.excerpt}</p>
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
