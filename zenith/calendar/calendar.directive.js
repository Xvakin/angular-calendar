/**
 * @ngdoc directive
 * @name zenith.calendar:zCalendar
 * @element z:calendar
 * @param {string} active-date Current date
 * @param {string} min-date Min calendar date
 * @param {string} max-date Max calendar date
 * @restrict E
 * @description
 * Creates UI element for accordion.
 *
 * **Note:** no notes
 *
 * @example
 <example module="zenith">
 <file name="index.html">
 <z:calendar></z:calendar>
 </file>
 </example>

 *@doc example
 <doc:source module="z">
 <script></script> <!-- Contents will be extracted into a script.js file -->
 <style></style> <!-- Contents will be extracted into a style.css file -->
 </doc:source>
 <doc:scenario>
 dsf
 </doc:scenario>
 </doc:example>

 */

(function () {
    angular.module('zenith.calendar', [])
        .directive('zCalendar', function () {
            return {
                restrict: 'E',
                scope: {
                    show: '=?',
                    title: '@?'
                },
                replace: true,
                transclude: true,
                templateUrl: '/zenith.dev/src/components/calendar/calendar.html',
                controller: CalendarController,
                controllerAs: 'ctrl',
                bindToController: true
            };
        });

    function CalendarController($scope, $element, $attrs) {
        var ctrl = this;

        ctrl.activeDate = angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date();
        ctrl.rows = [];
        ctrl.moveMonth = moveMonth;
        ctrl.selectDate = selectDate;
        ctrl.isActiveDate = isActiveDate;

        var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            year = ctrl.activeDate.getFullYear(),
            month = ctrl.activeDate.getMonth(),
            firstDayOfMonth = new Date(year, month, 1),
            firstDate = new Date(firstDayOfMonth),
            difference = 0 - firstDayOfMonth.getDay(),
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

        function selectDate(date) {
            ctrl.activeDate = date;
        }

        function isActiveDate(date) {
            if (compare(date, ctrl.activeDate) === 0) {
                return true;
            }
            return false;
        }

        function compare(date1, date2) {
            return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
        }

        refreshView();

    }

})();