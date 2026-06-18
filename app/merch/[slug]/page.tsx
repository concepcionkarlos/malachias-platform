// Page — /merch/[slug]: single-product page. Server-fetches one Fourthwall
// product (statically pre-rendered per slug, revalidated hourly), builds its SEO
// metadata, 404s on unknown slugs, and renders the ProductDetailClient.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchFWProduct, fetchFWProducts, fwPriceRange, fwFirstImage } from '@/lib/fourthwall';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchFWProduct(slug);
  if (!product) return { title: 'Product — MALACHIAS' };

  const img = fwFirstImage(product);
  return {
    title: `${product.name} — MALACHIAS Merch`,
    description: product.description.replace(/<[^>]+>/g, '').slice(0, 160),
    openGraph: {
      title: `${product.name} — MALACHIAS`,
      description: `${fwPriceRange(product)} · Official Malachias merchandise`,
      images: img ? [{ url: img }] : [],
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const products = await fetchFWProducts();
  return products.map(p => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchFWProduct(slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
