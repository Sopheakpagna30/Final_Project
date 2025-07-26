export function getYoutubeThumbnail(url) {
  const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    // Correct and common YouTube thumbnail URL format
    return `https://img.youtube.com/vi/${match[1]}/0.jpg`;
  }
  return null;
}