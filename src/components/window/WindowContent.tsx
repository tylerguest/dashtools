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

const viewMap: Record<Exclude<WindowContentType, null>, React.FC<any>> = {
  stockchart: StockChartView,
  quotemonitor: QuoteMonitorView,
  chatbot: ChatbotView,
  notes: NotesGridView,
};

const WindowContent: React.FC<WindowContentProps> = ({ content, notes, onNotesChange, user }) => {
  if (content == null) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
        Select a view from the dropdown menu
      </div>
    );
  }

  const ViewComponent = viewMap[content];

  if (ViewComponent) {
    if (content === 'notes') {
      return <NotesGridView user={user} />;
    }
    return <ViewComponent />;
  }

  return (
    <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
      Select a view from the dropdown menu
    </div>
  );
};

export default WindowContent;