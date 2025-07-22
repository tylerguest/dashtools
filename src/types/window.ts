export type WindowContent = 'timeline' | 'mixer' | 'stockchart' | 'quotemonitor' | 'chatbot' | 'notes' | null;

export interface WindowData {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  content?: WindowContent;
  notes?: string;
}

export interface WindowProps extends WindowData {
  workspaceBounds?: { width: number; height: number } | null;
  otherWindows?: Array<{ id: number; x: number; y: number; width: number; height: number }>;
  onMouseDown: (e: React.MouseEvent, id: number) => void;
  onResize: (id: number, x: number, y: number, width: number, height: number) => void;
  onClose: (id: number) => void;
  onContentChange?: (id: number, content: WindowContent) => void;
  onNotesChange?: (id: number, notes: string) => void;
}
