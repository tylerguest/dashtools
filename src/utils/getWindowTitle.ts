export function getWindowTitle(content: string, fallback: string) {
  switch (content) {
    case 'stockchart': return 'Stock Chart';
    case 'quotemonitor': return 'Quote Monitor';
    case 'chatbot': return 'Chatbot';
    case 'notes': return 'Notes';
    case 'files': return 'Files';
    default: return fallback;
  }
}