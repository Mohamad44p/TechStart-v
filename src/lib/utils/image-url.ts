export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '/placeholder.png'; // Provide a default placeholder image
  
  // If it's already an absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative URL without leading slash, add it
  if (!url.startsWith('/')) {
    return `/${url}`;
  }

  return url;
}
