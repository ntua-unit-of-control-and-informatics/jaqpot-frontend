import Page, { generateMetadata as generateModelMetadata } from '../page';

export async function generateMetadata(params: any) {
  return generateModelMetadata(params);
}

export default Page;
