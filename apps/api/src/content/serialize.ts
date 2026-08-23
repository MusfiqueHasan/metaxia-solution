import type { PricingPlan as DbPricingPlan, Post as DbPost, Job as DbJob } from '@prisma/client';
import type { PricingPlan, Post, Job } from '@metaxia/shared';

export const toPricingPlan = (p: DbPricingPlan): PricingPlan => ({
  id: p.id, name: p.name, price: p.price, period: p.period,
  description: p.description, features: JSON.parse(p.featuresJson) as string[],
  highlighted: p.highlighted, order: p.order,
});

export const toPost = (p: DbPost): Post => ({
  id: p.id, slug: p.slug, title: p.title, category: p.category,
  excerpt: p.excerpt, body: p.body, publishedAt: p.publishedAt.toISOString(),
});

export const toJob = (j: DbJob): Job => ({
  id: j.id, slug: j.slug, title: j.title, location: j.location,
  type: j.type, body: j.body, createdAt: j.createdAt.toISOString(),
});
