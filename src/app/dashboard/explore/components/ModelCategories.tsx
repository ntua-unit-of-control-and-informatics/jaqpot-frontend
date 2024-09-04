'use client';

import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';

const list = [
  {
    title: 'Linear Regression',
    img: '/model-categories/1.webp',
    description: 'Predicts continuous values like house prices, sales, etc.',
  },
  {
    title: 'Logistic Regression',
    img: '/model-categories/2.webp',
    description:
      'Binary classification problems like spam detection, disease diagnosis.',
  },
  {
    title: 'Decision Trees',
    img: '/model-categories/3.webp',
    description:
      'Classification and regression tasks such as customer segmentation, risk analysis.',
  },
  {
    title: 'Random Forest',
    img: '/model-categories/4.webp',
    description: 'Robust classification and regression, ensemble learning.',
  },
  {
    title: 'Support Vector Machines (SVM)',
    img: '/model-categories/5.webp',
    description: 'Image classification, text categorization.',
  },
  {
    title: 'K-Nearest Neighbors (KNN)',
    img: '/model-categories/6.webp',
    description: 'Recommendation systems, pattern recognition.',
  },
  {
    title: 'Neural Networks',
    img: '/model-categories/7.webp',
    description:
      'Complex tasks like image and speech recognition, language processing.',
  },
  {
    title: 'K-Means Clustering',
    img: '/model-categories/8.webp',
    description: 'Customer segmentation, market research.',
  },
];

export default function ModelCategories() {
  return (
    <>
      <h1 className="mb-5 text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
        Sample page
      </h1>
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {list.map((item, index) => (
          <Card shadow="sm" key={index} isPressable onPress={() => {}}>
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.title}
                className="h-[140px] w-full object-cover"
                src={item.img}
              />
            </CardBody>
            <CardFooter className="justify-between text-small">
              <b>{item.title}</b>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
