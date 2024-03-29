//const addEvent = new Event('addEvent');
document.addEventListener('DOMContentLoaded', function() {
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridWeek',
        displayEventEnd: false,
        //dragging on page
        selectable: true,
        dragScroll: true,
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
          },
          select: function(info){
            if (info.view.type == 'timeGridWeek' || info.view.type == 'timeGridDay') {
              let returned_value = prompt('This is the current date range selected: ' + info.startStr + ' to ' + info.endStr + '\n What instrument would you like to add availability for?');
              if (returned_value !== null || returned_value !== "") {
                let startString = info.startStr;
                let endstring = info.endStr;
                let startDate = new Date(startString);
                let endDate = new Date(endstring);
                while (startDate < endDate){
                  addEvent(returned_value, startDate, calendar);
                  startDate.setHours(startDate.getHours() + 1);
                  document.getElementById('appointmentDiv').insertAdjacentHTML('beforeEnd',`<li class="testTime"> ${startDate.toISOString()}</li>`);
                }
                calendar.render();
              }
            }
          }    
        });
    let calendarMO = document.getElementById('calendar-month');
    let calendar2 = new FullCalendar.Calendar(calendarMO, {
      initialView: 'dayGridMonth',
      displayEventEnd: false,
      forceEventDuration: true,
      contentHeight: "auto",
      headerToolbar: {
        left: '',
        center: 'title',
        right: ''
      }
      }); 
    calendar2.render();
    
    let items = document.getElementsByClassName("testTime");
    for(let i = 0; i<items.length;i++){
        let item = items[i].textContent;
        console.log(item);
        addEvent("test", item, calendar);
    }
    calendar.render();
    console.log(calendar.getEvents());
  });


  function addEvent(name, startTime, calendar) {
    let eventData = {
      title: name,
      start: startTime,
      allDay: false
    };
    calendar.addEvent(eventData);
}
// document.addEventListener('addEvent', function(e) {

// })
