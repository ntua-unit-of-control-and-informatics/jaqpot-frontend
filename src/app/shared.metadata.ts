import { Metadata } from 'next';

export const openGraphImage = { images: ['/opengraph-logo.png'] };
export const jaqpotAppDescription =
  "The Jaqpot project's app serves as the interactive gateway for users to engage with our predictive modeling platform. Users can upload models and obtain predictions seamlessly.";

export const generateSharedMetadata = (
  pageTitle: string = '',
  pageDescription: string = '',
): Metadata => {
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: `${pageTitle} | Jaqpot`,
    description: `${pageDescription ? pageDescription + '. ' : ''}${jaqpotAppDescription}`,
    openGraph: {
      title: `${pageTitle} | Jaqpot`,
      description: `${pageDescription ? pageDescription + '. ' : ''}${jaqpotAppDescription}`,
      ...openGraphImage,
    },
  };
};
