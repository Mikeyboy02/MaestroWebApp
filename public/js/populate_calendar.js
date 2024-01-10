document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        displayEventEnd: false,
        // defaultTimedEventDuration: '01:00',
        forceEventDuration: true,
        events: [
            { title: 'Meeting', start: new Date() }
        ],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          // customize the button names,
          // otherwise they'd all just say "list"
          views: {
            dayGridMonth: { buttonText: 'month' },
            timeGridWeek: { buttonText: 'week' },
            timeGridDay: { buttonText: 'day' }
          },
          eventClick: function(info) {
            alert('Event: ' + info.event.title + '\n' + 'Start: ' + info.event.start + '\n' + 'End: ' + info.event.end + '\n');
        
            // change the border color just for fun
            info.el.style.borderColor = 'red';
          }
    });
    var items = document.getElementsByClassName("testTime");
    for(var i = 0; i<items.length;i++){
        var item = items[i].textContent;
        console.log(item);
        addEvent("test", item, calendar);
    }
    calendar.render();
    console.log(calendar.getEvents());
  });


  function addEvent(name, startTime, calendar) {
    var eventData = {
      title: name,
      start: startTime,
      allDay: false
    };
    calendar.addEvent(eventData);
}
