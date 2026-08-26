export interface Service { id: string; slug: string; title: string; excerpt: string; body: string; icon: string; order: number; }
export interface CaseStudy { id: string; slug: string; title: string; category: string; excerpt: string; body: string; coverGradient: string; websiteUrl: string | null; previewImage: string | null; order: number; }
export interface Post { id: string; slug: string; title: string; category: string; excerpt: string; body: string; publishedAt: string; }
export interface TeamMember { id: string; slug: string; name: string; role: string; bio: string; linkedinUrl: string | null; order: number; }
export interface Job { id: string; slug: string; title: string; location: string; type: string; body: string; createdAt: string; }
export interface PricingPlan { id: string; name: string; price: number; period: string; description: string; features: string[]; highlighted: boolean; order: number; }
export interface FaqItem { id: string; question: string; answer: string; order: number; }
export interface Testimonial { id: string; quote: string; author: string; company: string; order: number; }
export interface ContactInput { name: string; email: string; phone?: string; message: string; }
export interface NewsletterInput { email: string; }
export interface LoginInput { email: string; password: string; }
export interface LoginResponse { accessToken: string; }
export interface ApiError { statusCode: number; message: string | string[]; error?: string; }
