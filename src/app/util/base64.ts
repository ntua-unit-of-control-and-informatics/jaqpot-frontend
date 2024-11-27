import { UserDto } from '@/app/api.types';

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (!reader.result) {
        reject(new Error('Failed to read file'));
        return;
      }
      // Get only the base64 string part after the comma
      const base64String = reader.result.toString().split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });

export const fromBase64ToImage = (
  base64String?: string,
): string | undefined => {
  if (!base64String) {
    return undefined;
  }
  return `data:image/png;base64,${base64String}`;
};
