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
              }
            }
          }    
        });
        calendar.render();
    }
)