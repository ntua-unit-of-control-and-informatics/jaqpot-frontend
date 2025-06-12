import Page, { generateMetadata as generateModelMetadata } from '../page';

export async function generateMetadata(params: any) {
  return generateModelMetadata(/* @next-codemod-error 'params' is passed as an argument. Any asynchronous properties of 'props' must be awaited when accessed. */
  params);
}

export default Page;
