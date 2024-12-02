import { Metadata } from 'next';

export const openGraphImage = { images: ['/opengraph-logo.png'] };
export const jaqpotAppDescription =
  "The Jaqpot project's app serves as the interactive gateway for users to engage with our predictive modeling platform. Users can upload models and obtain predictions seamlessly.";

export const generateSharedMetadata = (
  pageTitle: string = '',
  pageDescription: string = '',
  imageUrls: string[] = [],
): Metadata => {
  const ogImageUrls = imageUrls.map((imageUrl) => ({
    url: imageUrl,
  }));
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: `${pageTitle} | Jaqpot`,
    description: `${pageDescription ? pageDescription + '. ' : ''}${jaqpotAppDescription}`,
    openGraph: {
      title: `${pageTitle} | Jaqpot`,
      url: process.env.NEXT_PUBLIC_APP_URL!,
      type: 'website',
      description: `${pageDescription ? pageDescription + '. ' : ''}${jaqpotAppDescription}`,
      images: [...ogImageUrls, '/opengraph-logo.png'],
    },
  };
};
