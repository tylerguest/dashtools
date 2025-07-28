
import React from 'react';
import StockChartView from '../views/StockChart/StockChartView';
import QuoteMonitorView from '../views/QuoteMonitor/QuoteMonitorView';
import ChatbotView from '../views/Chatbot/ChatbotView';
import NotesGridView from '../views/Notes/NotesGridView';
import { WindowContent as WindowContentType } from '../../types/window';
import FilesView from '../views/Files/FilesView';
import { windowContentClassNames } from '../../styles/classNames';
import CalendarView from '../views/Calendar/CalendarView';

interface WindowContentProps { content: WindowContentType; notes?: string; onNotesChange?: (notes: string) => void; user?: any; }

const viewMap: Record<Exclude<WindowContentType, null>, React.FC<any>> = {
  stockchart: StockChartView, 
  quotemonitor: QuoteMonitorView,
  chatbot: ChatbotView, 
  notes: NotesGridView,
  files: FilesView,
  calendar: CalendarView,
};

const WindowContent: React.FC<WindowContentProps> = ({ content, notes, onNotesChange, user }) => {

  if (content == null) {
    return (
      <div className={windowContentClassNames.emptyState}>
        Select a view from the dropdown menu
      </div>
    );
  }

  const ViewComponent = viewMap[content];

  if (ViewComponent) {
    if (content === 'notes') { return <NotesGridView user={user} />; }
    return <ViewComponent />;
  }

  return (
    <div className={windowContentClassNames.emptyState}>
      Select a view from the dropdown menu
    </div>
  );
};

export default WindowContent;