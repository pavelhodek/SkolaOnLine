; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('SelectedDateService', ['$log', function ($log) {
        //var selectedDate = new Date(); //new Date(2014, 3, 1);
        var selectedDate = moment();

        return {
            getSelectedDate: function () {
                return selectedDate;
            },
            /*
            setSelectedDate: function (date) {
                selectedDate = date;
            },
            */

            incrementSelectedDate: function () {
/*
                selectedDate.setDate(selectedDate.getUTCDate() + 1);
                $log.debug(selectedDate);
                return selectedDate;
*/
                selectedDate.add(1, 'days');
                return selectedDate;
            },
            decrementSelectedDate: function () {
/*
                selectedDate.setDate(selectedDate.getUTCDate() - 1);
                $log.debug(selectedDate);
                return selectedDate;
*/
                selectedDate.add(-1, 'days');
                return selectedDate;
            },


            //new Date('2014', '11' - 1, '27', '12', '30', '00')
            getLocalDateFromIsoString: function (iso) {
/*
                // 2014-11-27T12:30:00 
                var split = iso.split('T');
                var date = split[0];
                var time = split[1];
                var dateSplit = date.split('-');
                var timeSplit = time.split(':');
                return new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], timeSplit[0], timeSplit[1], timeSplit[2]);
*/
              return moment(iso);
            },

            getIsoString: function() {
              return selectedDate.format("YYYY-MM-DD");
            }

        }
    }]);
})();


