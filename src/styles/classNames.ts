export const calendarViewClassNames = {
  container: "bg-zinc-800 text-zinc-200 rounded-xl shadow-2xl border border-zinc-800 w-full h-full flex flex-col",
  event: "bg-blue-700 text-white rounded-lg px-3 py-1 shadow-md font-medium",
  today: "bg-zinc-800 border-2 border-blue-500 text-white",
  header: "text-zinc-100 font-bold text-base tracking-wide",
  dayCell: "bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors duration-150",
};
export function windowHeaderMenuButton(extra?: string) {
  return [
    buttonClassNames.base,
    buttonClassNames.ghost,
    buttonClassNames.sizes.md,
    "w-full flex justify-between items-center",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}
export function windowHeaderMenuItem(extra?: string) {
  return [
    buttonClassNames.base,
    buttonClassNames.ghost,
    buttonClassNames.sizes.sm,
    "w-full text-left",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}
export const rootContainer = "min-h-screen h-full bg-gray-950 flex flex-col";
export const mainContent = "flex-1 flex h-full items-center justify-center text-zinc-400";
export const filesViewClassNames = {
  container: "h-full w-full flex flex-col bg-zinc-800",
  toolbar: "flex items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900/95 gap-2",
  list: "flex-1 overflow-y-auto p-4 flex flex-col gap-2",
  empty: "text-zinc-500 text-center py-8",
  rowBase: "group flex items-center px-3 py-2 border-b border-zinc-700 bg-transparent cursor-pointer transition-all hover:bg-zinc-800",
  icon: "mr-3 text-2xl",
  name: "flex-1 font-medium text-zinc-100 truncate text-base",
  type: "text-zinc-400 text-xs ml-2",
  gridItem: "aspect-square w-full max-w-[120px] flex flex-col items-center justify-center bg-zinc-900 border border-zinc-700 cursor-pointer transition-all hover:bg-zinc-800 p-3",
};
export const buttonClassNames = {
  base: [
    'inline-flex justify-center font-medium',
    'transition-all duration-150',
    'focus:outline-none focus:ring-1 focus:ring-zinc-600',
    'disabled:opacity-50 disabled:pointer-events-none',
    'leading-none',
    'bg-zinc-800 text-zinc-300',
    'rounded-none',
    'shadow-none',
    'w-[26px] h-[26px]',
    'text-base',
    'select-none',
    'active:bg-zinc-700',
    'active:text-zinc-100',
    'hover:bg-zinc-700',
    'hover:text-zinc-100',
    'focus:bg-zinc-700',
    'transition-transform',
    'p-0',
  ].join(' '),
  primary: [
    'bg-blue-700 text-white',
    'hover:bg-blue-800',
    'active:bg-blue-900',
    'focus:ring-blue-700',
    'shadow-none',
  ].join(' '),
  secondary: [
    'bg-zinc-700 text-zinc-200',
    'hover:bg-zinc-600',
    'active:bg-zinc-800',
    'focus:ring-zinc-500',
    'shadow-none',
  ].join(' '),
  danger: [
    'bg-red-700 text-white',
    'hover:bg-red-800',
    'active:bg-red-900',
    'focus:ring-red-700',
    'shadow-none',
  ].join(' '),
  outline: [
    'border border-zinc-600 text-zinc-300 bg-transparent',
    'hover:bg-zinc-800',
    'focus:ring-zinc-600',
    'shadow-none',
  ].join(' '),
  ghost: [
    'bg-transparent text-zinc-400',
    'hover:bg-zinc-800',
    'focus:ring-zinc-600',
    'shadow-none',
  ].join(' '),
  icon: [
    'bg-zinc-800 hover:bg-zinc-700 text-zinc-300',
    'rounded-none',
    'p-1.5',
    'shadow-none',
  ].join(' '),
  sizes: {
    xs: 'w-6 h-6 text-xs p-0',
    sm: 'w-8 h-8 text-sm p-0',
    md: 'w-10 h-10 text-base p-0',
    lg: 'w-12 h-12 text-lg p-0',
    xl: 'w-16 h-16 text-xl p-0',
  },
};
export const chatbotViewClassNames = {
  container: 'w-full h-full flex flex-col bg-zinc-900 text-zinc-200 font-mono text-sm p-2',
  chatArea: 'flex-1 overflow-y-auto bg-zinc-800 p-2 mb-2',
  messageRowBase: 'mb-2 flex',
  userMessageRow: 'justify-end',
  botMessageRow: 'justify-start',
  messageBubbleBase: 'max-w-[70%] px-3 py-2',
  userMessageBubble: 'bg-blue-600 text-white',
  botMessageBubble: 'bg-zinc-700 text-zinc-200',
  loadingRow: 'mb-2 flex justify-start',
  loadingBubble: 'max-w-[70%] px-3 py-2 bg-zinc-700 text-zinc-400 italic animate-pulse',
  inputRow: 'flex gap-2 items-center',
  input: 'flex-1 bg-zinc-800 px-3 py-2 outline-none border border-zinc-700 focus:border-blue-500',
};
export const notesGridViewClassNames = {
  container: "h-full w-full flex bg-zinc-800",
  notesPane: "h-full border-r border-zinc-700 bg-zinc-900/95 flex flex-col",
  notesPaneHeader: "flex items-center justify-between px-4 py-3 border-b border-zinc-800",
  notesTitle: "text-lg font-bold text-zinc-100",
  hideNotesButton: "ml-1 px-1 py-0 text-zinc-400 hover:text-zinc-200 text-sm border-none bg-transparent transition-all focus:outline-none flex items-center justify-center",
  notesList: "flex-1 overflow-y-auto",
  emptyNotes: "text-zinc-500 text-center py-8",
  noteRowBase: "group flex items-center px-4 py-3 border-b border-zinc-800 cursor-pointer transition-all",
  noteRowSelected: "bg-zinc-800/80",
  noteRowHover: "hover:bg-zinc-800/60",
  noteTitle: "font-medium text-zinc-100 truncate text-base",
  noteContent: "text-zinc-400 text-xs truncate",
  deleteButton: "ml-2 text-red-500 opacity-70 hover:opacity-100 text-sm font-bold px-1 rounded transition-all",
  resizer: "group w-2 cursor-col-resize h-full bg-transparent hover:bg-zinc-700/40 transition-colors z-30 select-none",
  rightPane: "flex-1 h-full flex flex-col bg-zinc-800",
  loading: "text-zinc-400 p-8",
  noteFormContainer: "h-full w-full flex flex-col p-8",
  noteFormHeader: "flex items-center mb-4",
  backButton: "flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition shadow focus:outline-none focus:ring-2 focus:ring-zinc-500",
  noteFormTitle: "ml-3 text-xl font-semibold text-zinc-100",
  noteInput: "mb-4 text-2xl font-semibold bg-transparent border-none outline-none text-white placeholder-zinc-400",
  noteTextarea: "flex-1 resize-none bg-zinc-800 border-none outline-none text-white placeholder-zinc-400 text-lg",
  rightPaneDefault: "flex flex-col h-full w-full",
  showNotesButton: "mt-3 ml-3 px-1 py-0 text-zinc-400 hover:text-zinc-200 text-sm border-none bg-transparent transition-all focus:outline-none flex items-center justify-center",
  addNoteButton: "w-6 h-6 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-zinc-100 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500 border border-zinc-600 shadow-none rounded-none p-0",
  deleteModalOverlay: "fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm",
  deleteModal: "bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-[90vw] flex flex-col items-center animate-fadeIn",
  deleteModalTitle: "text-2xl font-bold text-white mb-2 tracking-tight",
  deleteModalText: "text-zinc-400 mb-8 text-center text-base",
  deleteModalActions: "flex gap-4 w-full justify-center",
  cancelButton: "px-6 py-2 rounded-full bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 text-zinc-200 font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500",
  confirmDeleteButton: "px-6 py-2 rounded-full bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 active:from-red-800 active:to-red-700 text-white font-bold transition-all shadow focus:outline-none focus:ring-2 focus:ring-red-500",
};
export const notesViewClassNames = {
  container: 'w-full h-full flex flex-col bg-zinc-900 text-zinc-200 font-mono text-sm p-2',
  textarea: 'flex-1 bg-zinc-800 text-zinc-200 p-2 rounded resize-none outline-none border-2 border-zinc-700 focus:border-zinc-700 focus:outline-none',
};
export const quoteMonitorViewClassNames = {
  container: 'w-full h-full bg-zinc-900 text-zinc-200 font-mono text-xs p-2 overflow-auto relative',
  headerRow: 'mb-2 flex items-center justify-between',
  mainLabel: 'bg-green-900 text-green-300 px-2 py-0.5 rounded text-xs ml-2',
  tickerInputRow: 'flex items-center gap-1 relative',
  tickerInput: 'bg-zinc-800 text-zinc-200 px-2 py-0.5 text-xs border border-zinc-700 focus:outline-none w-48 rounded-none',
  addButton: 'bg-green-700 text-xs px-2 py-0.5 rounded text-green-100 hover:bg-green-600',
  tickerSelector: 'absolute left-0 top-full z-50 mt-1',
  tableWrapper: 'overflow-x-auto',
  table: 'w-full border-separate border-spacing-y-0.5',
  theadRow: 'text-zinc-400 bg-zinc-800',
  thBase: 'px-2 py-1 text-right cursor-pointer select-none',
  thTicker: 'px-2 py-1 text-left cursor-pointer select-none',
  tdTicker: 'px-2 py-1 font-bold text-zinc-100',
  tdBase: 'px-2 py-1 text-right transition-colors duration-150',
  tdChg: 'px-2 py-1 text-right font-bold transition-colors duration-150',
  tdLatency: 'px-2 py-1 text-right text-green-300',
  removeButton: 'text-red-400 hover:text-red-600 text-xs px-1',
};
export const stockChartViewClassNames = {
  container: 'w-full h-full bg-zinc-900 border border-zinc-700 rounded shadow-lg overflow-hidden',
  iframe: '',
};
export const tickerSelectorWindowClassNames = {
  container: 'min-w-[140px] max-w-[180px] max-h-64 bg-zinc-900 border border-zinc-700 flex flex-col text-xs select-none',
  list: 'overflow-y-auto',
  button: 'block w-full text-left px-3 py-1 text-zinc-100 hover:bg-zinc-700/60 hover:text-white text-xs',
};
export const windowContentClassNames = {
  emptyState: 'h-full flex items-center justify-center text-zinc-500 text-sm',
};
export const windowHeaderClassNames = {
  header: 'p-2 bg-zinc-900/60 border-b border-zinc-700 text-zinc-200 font-normal text-sm flex justify-between items-center relative',
  menuButton: 'w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/60 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500 shadow-md bg-zinc-800/80 backdrop-blur',
  dropdown: 'absolute top-8 left-0 min-w-[170px] max-w-[220px] bg-zinc-900/95 backdrop-blur border border-zinc-700 shadow-xl z-50 py-1 flex flex-col gap-0 animate-fadeIn',
  menuCategory: 'relative group',
  menuCategoryButton: 'block w-full text-left px-3 py-2 text-zinc-100 hover:bg-zinc-700/60 hover:text-white text-sm transition-all focus:outline-none focus:bg-zinc-700/80 focus:text-white flex justify-between items-center',
  submenu: 'absolute left-full top-0 min-w-[150px] max-w-[200px] bg-zinc-900/95 backdrop-blur border border-zinc-700 shadow-xl z-50 py-1 flex flex-col gap-0 animate-fadeIn',
  submenuButton: 'block w-full text-left px-3 py-2 text-zinc-100 hover:bg-zinc-700/60 hover:text-white text-sm transition-all focus:outline-none focus:bg-zinc-700/80 focus:text-white',
  titleContainer: 'flex-1 flex justify-center items-center select-none',
  title: 'text-zinc-200 text-base font-bold',
  closeButton: 'w-4 h-4 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 text-xs font-bold',
};
export const windowResizerClassNames = {
  nw: 'absolute w-2 h-2 hover:bg-zinc-600 top-0 left-0 cursor-nw-resize',
  ne: 'absolute w-2 h-2 hover:bg-zinc-600 top-0 right-0 cursor-ne-resize',
  sw: 'absolute w-2 h-2 hover:bg-zinc-600 bottom-0 left-0 cursor-sw-resize',
  se: 'absolute w-2 h-2 hover:bg-zinc-600 bottom-0 right-0 cursor-se-resize',
  n: 'absolute hover:bg-zinc-600 top-0 left-2 right-2 h-1 cursor-n-resize',
  s: 'absolute hover:bg-zinc-600 bottom-0 left-2 right-2 h-1 cursor-s-resize',
  w: 'absolute hover:bg-zinc-600 left-0 top-2 bottom-2 w-1 cursor-w-resize',
  e: 'absolute hover:bg-zinc-600 right-0 top-2 bottom-2 w-1 cursor-e-resize',
};
export const customViewsMenuClassNames = {
  container: 'relative flex items-center',
  menuButton: 'text-xs px-2 py-1 bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 mr-2',
  dropdownBase: 'absolute top-10 min-w-[180px] max-w-[240px] bg-zinc-900/95 backdrop-blur border border-zinc-700 shadow-xl p-2 z-50 transition-all',
  input: 'w-full px-2 py-1 bg-zinc-800/90 text-zinc-200 border border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/20 outline-none mb-1 text-xs transition-all placeholder-zinc-400',
  saveButton: 'w-full py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold text-xs shadow-sm transition-all mb-1',
  viewsList: 'max-h-32 overflow-y-auto space-y-0.5',
  emptyViews: 'text-zinc-400 text-xs text-center py-1',
  viewRow: 'flex items-center group bg-zinc-800/70 hover:bg-zinc-700/80 px-1 py-0.5 transition-all',
  viewButton: 'text-left text-zinc-200 group-hover:text-zinc-100 font-medium text-xs flex-1 truncate transition-all',
  deleteButton: 'ml-1 text-red-500 opacity-70 hover:opacity-100 text-sm font-bold px-0.5 transition-all',
};
export const headerClassNames = {
  header: 'bg-zinc-900 border-b border-zinc-700 px-3 py-1 flex justify-between items-center',
  left: 'flex items-center gap-4',
  title: 'text-zinc-200 text-base font-black',
  right: 'flex items-center gap-1',
  newWindowButton: 'text-zinc-200 text-xs font-bold w-8 h-8 p-0 rounded hover:bg-zinc-800 flex items-center justify-center',
};
export const userMenuClassNames = {
  container: 'relative',
  menuButton: 'w-6.5 h-6.5 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200',
  dropdown: 'absolute right-0 mt-2 min-w-[160px] max-w-[220px] bg-zinc-900/95 backdrop-blur border border-zinc-700 shadow-xl p-2 z-[9999] transition-all',
  form: 'flex flex-col gap-2',
  label: 'text-zinc-200 text-sm',
  input: 'bg-zinc-800 px-3 py-2 outline-none border border-zinc-700 focus:border-blue-500 text-zinc-200',
  error: 'text-red-400 text-xs',
  submitButton: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-bold mt-2',
  switchButton: 'text-xs text-blue-400 mt-1 underline',
  userInfo: 'flex flex-col gap-2 items-center py-2',
  userEmail: 'text-zinc-100 font-semibold text-xs mb-2 break-all text-center',
  signOutButton: 'w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold text-xs shadow-sm transition-all',
};
export const windowClassNames = {
  window: 'absolute z-50 bg-zinc-800 border border-zinc-700 rounded-none shadow-2xl flex flex-col',
  windowSelectedHighlight: 'pointer-events-none box-border absolute top-0 left-0 w-full h-full border-[3px] border-[#6b7280] shadow-[0_0_8px_#6b7280] z-[100]',
  header: 'cursor-move',
  content: 'flex-1 p-1 overflow-auto h-full w-full',
};
export const workspaceClassNames = {
  container: 'flex h-full w-full bg-zinc-800',
  workspaceArea: 'flex-1 h-full relative overflow-hidden',
};
