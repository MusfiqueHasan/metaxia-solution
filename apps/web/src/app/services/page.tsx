import type { Metadata } from 'next';
import Link from 'next/link';
import { getServices } from '@/lib/api';
import { PageHero } from '@/components/page-hero';
import { Container } from '@/components/container';
import { Reveal } from '@/components/motion/reveal';
import { Icon, type IconKey } from '@/components/icon';
import { SectionBackdrop } from '@/components/section-backdrop';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Six practice areas tuned for the AI era — LLM integration, cloud, product, security, and mobile engineering.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services',
    description:
      'Six practice areas tuned for the AI era — LLM integration, cloud, product, security, and mobile engineering.',
  },
};

/** First bullets under "## What we deliver", trimmed for the card. */
function deliverables(body: string, limit = 3): string[] {
  const section = body.split(/##\s*What we deliver/i)[1];
  if (!section) return [];
  const items: string[] = [];
  for (const line of section.split('\n')) {
    const match = line.match(/^\s*-\s+(.*)/);
    if (match) {
      const text = match[1].replace(/[*_`]/g, '').trim();
      items.push(text.length > 72 ? `${text.slice(0, 72).replace(/\s+\S*$/, '')}…` : text);
      if (items.length === limit) break;
    } else if (items.length > 0 && /^##/.test(line)) {
      break;
    }
  }
  return items;
}

const AI_PROOFS = [
  { value: 'LLM apps', note: 'RAG pipelines grounded in your own data' },
  { value: 'Copilots', note: 'Assistants inside the tools your team lives in' },
  { value: 'Automation', note: 'Agents that clear the repetitive work' },
];

/** A small neural graph: three layers, faint synapses, signals in flight. */
function NeuralGraph() {
  const layers = [
    { x: 30, ys: [50, 105, 160, 215] },
    { x: 160, ys: [35, 90, 145, 200, 255] },
    { x: 290, ys: [80, 145, 210] },
  ];
  const edges: Array<[number, number, number, number]> = [];
  for (let l = 0; l < layers.length - 1; l += 1) {
    for (const y1 of layers[l].ys) {
      for (const y2 of layers[l + 1].ys) {
        edges.push([layers[l].x, y1, layers[l + 1].x, y2]);
      }
    }
  }
  const signals = [
    `M30,105 C95,105 95,90 160,90 C225,90 225,145 290,145`,
    `M30,160 C95,160 95,200 160,200 C225,200 225,210 290,210`,
    `M30,50 C95,50 95,35 160,35 C225,35 225,80 290,80`,
  ];

  return (
    <svg
      viewBox="0 0 320 290"
      className="h-full w-full"
      role="img"
      aria-label="Neural network diagram"
    >
      {edges.map(([x1, y1, x2, y2], index) => (
        <path
          key={index}
          d={`M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`}
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity="0.14"
          strokeWidth="1"
        />
      ))}
      {signals.map((path, index) => (
        <circle key={index} r="2.5" fill="var(--color-accent)">
          <animateMotion
            dur={`${2.8 + index * 0.9}s`}
            begin={`${index * 0.7}s`}
            repeatCount="indefinite"
            path={path}
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.15;0.85;1"
            dur={`${2.8 + index * 0.9}s`}
            begin={`${index * 0.7}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      {layers.map((layer, layerIndex) =>
        layer.ys.map((y, nodeIndex) => (
          <g key={`${layerIndex}-${nodeIndex}`}>
            <circle cx={layer.x} cy={y} r="5" fill="var(--color-ink)" stroke="var(--color-accent)" strokeOpacity="0.55" strokeWidth="1.2" />
            <circle cx={layer.x} cy={y} r="2" fill="var(--color-accent)" fillOpacity="0.8">
              <animate
                attributeName="fill-opacity"
                values="0.35;0.9;0.35"
                dur="3.2s"
                begin={`${(layerIndex * 5 + nodeIndex) * 0.35}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )),
      )}
    </svg>
  );
}

export default async function ServicesPage() {
  const services = await getServices();
  const ai = services.find((service) => service.slug === 'ai-integration');
  const rest = services.filter((service) => service.slug !== 'ai-integration');
  const aiPoints = ai ? deliverables(ai.body) : [];

  return (
    <main className="page-wide">
      <PageHero
        eyebrow="Services"
        title="Six practices, tuned for the AI era."
        lede="Your users already expect software that thinks. Every engagement below ships with that expectation built in — from the data layer up."
      />

      {/* Flagship: AI Integration */}
      {ai ? (
        <section className="grain relative overflow-clip bg-ink pt-20 lg:pt-24">
          <Container>
            <Reveal>
              <div className="reveal-rise relative overflow-clip rounded-[2rem] border border-accent/25 bg-ink-raised/60 lg:grid lg:grid-cols-[1.15fr_1fr]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-[90px]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-accent/[0.07] blur-[90px]"
                />

                <div className="relative p-8 sm:p-10 lg:p-14">
                  <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    The flagship practice
                  </p>
                  <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.01em] text-fg sm:text-5xl">
                    Software that thinks is <em className="text-accent">table stakes</em> now.
                  </h2>
                  <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-soft">
                    {ai.excerpt} We put language models to work inside real products — grounded in
                    your data, measured against your metrics, and priced like engineering, not
                    magic.
                  </p>

                  <dl className="mt-9 grid gap-6 border-t border-line pt-7 sm:grid-cols-3">
                    {AI_PROOFS.map((proof) => (
                      <div key={proof.value}>
                        <dt className="font-display text-xl tracking-tight text-fg">
                          {proof.value}
                        </dt>
                        <dd className="mt-1.5 text-[13px] leading-relaxed text-fg-soft">
                          {proof.note}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={`/services/${ai.slug}`}
                    className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Explore AI Integration
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className="relative hidden border-l border-line/60 lg:block">
                  <div className="absolute inset-0 p-10">
                    <NeuralGraph />
                  </div>
                  {aiPoints.length > 0 ? (
                    <div className="absolute inset-x-10 bottom-8 rounded-2xl border border-line bg-ink/80 p-5 backdrop-blur">
                      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-fg-soft">
                        In every engagement
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-fg-soft/90">
                        {aiPoints[0]}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* The other five practices */}
      <section className="grain relative overflow-clip bg-ink py-20 lg:py-24">
        <SectionBackdrop glow="right" variant="ceiling" />
        <Container>
          <Reveal className="mb-12 flex items-baseline gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-fg-soft">
            <span className="reveal-fade inline-flex items-center gap-3">
              <span className="inline-block h-px w-6 self-center bg-line-strong" aria-hidden="true" />
              And the practices around it — AI only works on solid ground
            </span>
          </Reveal>

          {rest.length > 0 ? (
            <Reveal>
              <ul className="grid gap-5 sm:grid-cols-2">
                {rest.map((service, index) => {
                  const points = deliverables(service.body);
                  return (
                    <li
                      key={service.slug}
                      className="reveal-rise"
                      style={{ ['--reveal-delay' as string]: `${index * 0.07}s` }}
                    >
                      <Link
                        href={`/services/${service.slug}`}
                        className="group relative flex h-full flex-col overflow-clip rounded-3xl border border-line bg-ink-raised/50 p-8 transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 hover:border-accent/40 hover:bg-ink-raised lg:p-10"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-accent/10 opacity-0 blur-[70px] transition-opacity duration-700 group-hover:opacity-100"
                        />

                        <span className="relative flex items-center justify-between">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-ink text-accent transition-colors duration-300 group-hover:border-accent/40">
                            <Icon name={service.icon as IconKey} className="h-5 w-5" />
                          </span>
                          <span className="font-mono text-sm tracking-[0.2em] text-fg-soft/50 transition-colors duration-300 group-hover:text-accent">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </span>

                        <span className="relative mt-8 font-display text-2xl tracking-[-0.01em] text-fg transition-colors duration-300 group-hover:text-accent-strong sm:text-3xl">
                          {service.title}
                        </span>
                        <span className="relative mt-3 block text-sm leading-relaxed text-fg-soft">
                          {service.excerpt}
                        </span>

                        {points.length > 0 ? (
                          <span className="relative mt-7 block space-y-2.5 border-t border-line pt-6">
                            {points.map((point) => (
                              <span
                                key={point}
                                className="flex items-start gap-3 text-[13px] leading-relaxed text-fg-soft/90"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-accent/60"
                                />
                                {point}
                              </span>
                            ))}
                          </span>
                        ) : null}

                        <span className="relative mt-auto flex items-center gap-2 pt-8 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-fg-soft transition-colors duration-300 group-hover:text-accent">
                          Explore practice
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          >
                            <path
                              d="M2 8h11M9 3.5 13.5 8 9 12.5"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ) : (
            <p className="text-sm text-fg-soft">Services are temporarily unavailable.</p>
          )}
        </Container>
      </section>
    </main>
  );
}
