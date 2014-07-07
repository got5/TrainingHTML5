/**
 * Created by pierremarot on 17/06/2014.
 */
var dateUtils = (function () {

    var month_names = [];
    month_names[month_names.length] = "January";
    month_names[month_names.length] = "February";
    month_names[month_names.length] = "March";
    month_names[month_names.length] = "April";
    month_names[month_names.length] = "May";
    month_names[month_names.length] = "June";
    month_names[month_names.length] = "July";
    month_names[month_names.length] = "August";
    month_names[month_names.length] = "September";
    month_names[month_names.length] = "October";
    month_names[month_names.length] = "November";
    month_names[month_names.length] = "December";


    var getDateTime = function (time) {
        var date = new Date(parseInt(time));
        var ret = date.getFullYear();
        ret += " ";
        ret += date.getMonth();
        ret += " ";
        ret += date.getDay();

        return ret;
    };
    var getDisplayDate = function (time) {
        var date = new Date(parseInt(time));
        var ret = month_names[date.getMonth()];
        ret += " ";

        var day = date.getDay();
        var suffix;

        switch (day % 10 ) {
            case 1:
                suffix = "st";
                break;
            case 2:
                suffix = "nd";
                break;
            case 3:
                suffix = "rd";
                break;
            default :
                suffix = "th";
        }
        ret += day + suffix;
        ret += ", ";
        ret += date.getFullYear();

        return ret;
    };

    return {
        getDateTime: getDateTime,
        getDisplayDate: getDisplayDate
    }
})
();
