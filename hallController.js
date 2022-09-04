// план зала по рядам
var cinemaHall = {
        row: [5, 10, 10, 10]
    },
    currentDate = new Date(),
    dates = createDates(currentDate),
    cinemaHallMap = makeHallSeats(cinemaHall);

createShowtimeMenu(formatDates(dates));

//заполняем в html зал
$('.cinemaHall').html(cinemaHallMap);

// тут по клику определяем что место выкуплено
$('.seat').on('click', function (e) {
    // если первый раз кликнули билет выкупили,
    // если повторно значит вернули билет
    $(e.currentTarget).toggleClass('busy');
    //показываем сколько билетов выкуплено
    showBaySeat();
});

$('.showtime').on('click', function (e) {
    $.each($('.showtime.selected'), function (key, item) {
        $(item).removeClass('selected');
    });
    $(e.currentTarget).toggleClass('selected');

    var time = $(e.currentTarget).data().time,
        seatInfos = getSeatInfosFromLocalStorage(time);

    $.each($('.seat.busy'), function (key, item) {
        $(item).removeClass('busy');
    })

    if (seatInfos != null) {
        $.each(seatInfos, function (index, seatInfo) {
            var seat = $('[data-row=' + seatInfo.row + '] [data-seat=' + seatInfo.seat + ']');
            seat.addClass('busy');
        });
    }

    $('.cinemaHall').show();
});

// показать выбранные билеты в "результате"
function showBaySeat() {
    var result = '',
        date = $('.showtime.selected').data().time,
        seatInfos = [];
    //ищем все места купленные и показываем список выкупленных мест

    $.each($('.seat.busy'), function (key, item) {
        var seatInfo = {
            row: $(item.parentElement).data().row,
            seat: $(item).data().seat,
            date: date
        };

        result += '<div class="ticket">Ряд: ' + seatInfo.row
            + ' Место:' + seatInfo.seat + '</div>';

        seatInfos.push(seatInfo);
    });

    $('.result').html(result);
    saveSeatInfosToLocalStorage(seatInfos);
}

// создать представление зала
function makeHallSeats(cinemaHall) {
    var cinemaHallMap = '';

    for (var rowNumber = 0; rowNumber < cinemaHall.row.length; rowNumber++) {
        var visualRowNumber = rowNumber + 1,
            cinemaHallRow = ''.concat('<div data-row="', visualRowNumber, '">')
                .concat('<span>Ряд ', visualRowNumber, '</span>'),
            numberOfSeats = cinemaHall.row[rowNumber];

        for (var i = 0; i < numberOfSeats; i++) {
            // собираем ряды
            var seatVisualNumber = i + 1;
            cinemaHallRow +=
                ''.concat('<div class="seat"',
                    // ' data-row="', (rowNumber + 1), '"',
                    ' data-seat="', seatVisualNumber, '">', seatVisualNumber, '</div>'
                );
        }
        //собираем зал с проходами между рядами
        cinemaHallMap += cinemaHallRow + '</div><div class="passageBetween">&nbsp;</div>';
    }
    return cinemaHallMap;
}

// Создать менюшки с датами
function createShowtimeMenu(dates) {
    var dateContainer = $('.dateContainer'),
        showtimeRows = '';

    $.each(dates, function(index, date) {
        showtimeRows += createShowtimesOnDate(date);
    });
    dateContainer.html(showtimeRows);
}


// Создать сеансы на дату
function createShowtimesOnDate(date) {
    var showtimeRow = '<div class="dateShowTime" data-date="' + date.toString() + '">' + date.toString() + ': ';

    for (var time = 10; time <= 20; time += 2) {
        showtimeRow += createShowtime(time);
    }

    showtimeRow += '</div>';
    return showtimeRow;
}

// Создать сеанс по указанному времени
function createShowtime(hour) {
    var time = hour + ':00';

    return ''.concat('<div class="showtime" data-time="', hour, '">', time, '</div>');
}

// создать список дат относительно текущей
function createDates(currentDate) {
    var dates = [];

    for (var day = -7; day <= 7; day++) {
        dates.push(addDaysToDate(currentDate, day));
    }

    return dates;
}

//форматирует даты к нормальному виду
function formatDates(dates) {
    var dateOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };
    var formattedDates = [];
    for (var i = 0; i < dates.length; i++) {
        formattedDates.push(dates[i].toLocaleString('ru', dateOptions));}
    return formattedDates;
}


// добавить даты к текущей дате
function addDaysToDate(date, days) {
    return new Date(new Date().setDate(date.getDate() + days))
}

// сохранить занятые места по дате и времени в localStorage
// todo: (пока что только по времени, что неправильно)
function saveSeatInfosToLocalStorage(seatInfos) {
    var date = seatInfos[0].date,
        json = JSON.stringify(seatInfos);

    localStorage.setItem(date, json);
}

// получить список занятых мест по дате и времени
// todo: (пока что только по времени, что неправильно)
function getSeatInfosFromLocalStorage(date) {
    var json = localStorage.getItem(date);

    return json != null ? JSON.parse(json) : null;
}