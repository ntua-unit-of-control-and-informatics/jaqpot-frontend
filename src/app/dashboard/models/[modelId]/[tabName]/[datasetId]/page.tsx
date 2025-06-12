import Page, { generateMetadata as generateModelMetadata } from '../page';

export async function generateMetadata(props: any) {
  return generateModelMetadata(props);
}

export default Page;
