export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  let truncated = text.substr(0, maxLength);

  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    truncated = truncated.substr(0, lastSpace);
  }

  truncated = truncated.replace(/[.,!?;:]$/, '');

  return truncated + '...';
}
