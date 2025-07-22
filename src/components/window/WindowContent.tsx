
import React from 'react';
import StockChartView from '../views/StockChartView';
import QuoteMonitorView from '../views/QuoteMonitorView';
import ChatbotView from '../views/ChatbotView';
import NotesGridView from '../views/NotesGridView';
import { WindowContent as WindowContentType } from '../../types/window';

interface WindowContentProps {
  content: WindowContentType;
  notes?: string;
  onNotesChange?: (notes: string) => void;
  user?: any;
}

const WindowContent: React.FC<WindowContentProps> = ({ content, notes, onNotesChange, user }) => {
  console.log('[WindowContent] rendered with content:', content, 'notes:', notes, 'onNotesChange:', typeof onNotesChange);
  if (content === 'stockchart') return <StockChartView />;
  if (content === 'quotemonitor') return <QuoteMonitorView />;
  if (content === 'chatbot') return <ChatbotView />;
  if (content === 'notes') return <NotesGridView user={user} />;
  return (
    <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
      Select a view from the dropdown menu
    </div>
  );
};

export default WindowContent;
