export const getAvatarFallbackImg = (email?: string | null) => {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${email?.replace(
    ' ',
    '',
  )}`;
};
