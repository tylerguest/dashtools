import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { calendarViewClassNames } from '../../../styles/classNames';

const CalendarView: React.FC = () => {
  const handleDateClick = (arg: any) => { alert(`Date clicked: ${arg.dateStr}`); };
  const renderEventContent = (eventInfo: any) => (
    <span className={calendarViewClassNames.event}>
      <b>{eventInfo.timeText}</b>
      <span style={{ marginLeft: 4 }}>{eventInfo.event.title}</span>
    </span>
  );
  return (
    <div className={calendarViewClassNames.container}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        themeSystem='bootstrap'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth, dayGridWeek, dayGridDay'
        }}
        events={[]}
        dayCellClassNames={date => date.isToday ? calendarViewClassNames.today : ''}
        eventContent={renderEventContent}
        height="auto"
        aspectRatio={1.5}
      />
    </div>
  );
};

export default CalendarView;