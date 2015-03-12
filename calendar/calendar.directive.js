(function () {
    angular.module('zenith.calendar', [])
        .directive('zCalendar', function () {
            return {
                restrict: 'E',
                scope: {
                    date: '=?'
                },
                controller: calendarController,
                controllerAs: 'ctrl',
                link: calendarLink,
                templateUrl: 'calendar/calendar.html'
            }
        });

    function calendarController($scope, $element, $attrs) {
        var ctrl = this;

        ctrl.activeDate = angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date();
        ctrl.rows = [];
        ctrl.moveMonth = moveMonth;

        var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            year = ctrl.activeDate.getFullYear(),
            month = ctrl.activeDate.getMonth(),
            firstDayOfMonth = new Date(year, month, 1),
            firstDate = new Date(firstDayOfMonth),
            difference = 1 - firstDayOfMonth.getDay(),
            numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : -difference;

        if (numDisplayedFromPreviousMonth > 0) {
            firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
        }

        function getDaysInMonth(year, month) {
            return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
        }

        function getDates(startDate, n) {
            var dates = new Array(n), current = new Date(startDate), i = 0;
            current.setHours(12); // Prevent repeated dates because of timezone bug
            while (i < n) {
                dates[i++] = new Date(current);
                current.setDate(current.getDate() + 1);
            }
            return dates;
        }

        function split(arr, size) {
            var arrays = [];
            while (arr.length > 0) {
                arrays.push(arr.splice(0, size));
            }
            return arrays;
        }

        function moveMonth(direction) {
            var year = ctrl.activeDate.getFullYear(),
                month = ctrl.activeDate.getMonth() + direction;
            ctrl.activeDate.setFullYear(year, month, 1);
            refreshView();
        }

        function refreshView() {
            var year = ctrl.activeDate.getFullYear(),
                month = ctrl.activeDate.getMonth(),
                firstDayOfMonth = new Date(year, month, 1),
                difference = 1 - firstDayOfMonth.getDay(),
                numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : -difference,
                firstDate = new Date(firstDayOfMonth);

            if (numDisplayedFromPreviousMonth > 0) {
                firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
            }

            // 42 is the number of days on a six-month calendar
            var days = getDates(firstDate, 42);

            ctrl.rows = split(days, 7);

        }

        refreshView();


    }

    function calendarLink(scope, element, attrs) {

    }
})();
