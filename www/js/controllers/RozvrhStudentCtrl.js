; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('RozvrhStudentCtrl', function ($scope, $rootScope, $log, $timeout, NastaveniService, SelectedDateService, RozvrhService) {
            //$log.debug('RozvrhCtrl');

        angular.element(document)
            .on("pagecreate", "#rozvrhStudent", function(event, ui) {
                //$log.debug("PAGECREATE - #ROZVRH - STUDENT");
            })
            .on("pagebeforeshow", "#rozvrhStudent", function(event, ui) {
                $('#rozvrhStudentContent').hide();
            })
            .on("pageshow", "#rozvrhStudent", function(event, ui) {
                $log.debug("PAGESHOW - #ROZVRH - STUDENT");
                $scope.init();
            })
            .on("swipeleft", "#rozvrhStudent", function (event, ui) {
                $log.debug("<= SWIPELEFT - #ROZVRH");
                $scope.incrementSelectedDate();

            })
            .on("swiperight", "#rozvrhStudent", function (event, ui) {
                $log.debug("=> SWIPERIGHT - #ROZVRH");
                $scope.decrementSelectedDate();
            });


            $scope.timeFormat = NastaveniService.timeFormat;
            $scope.dateFormat = NastaveniService.dateFormat;

            $scope.selectedDate = SelectedDateService.getSelectedDate();
            $scope.selectedDateString = $scope.selectedDate.locale("cs").format("dddd D.M.YYYY");

            $scope.reset = function () {
                $scope.data = {};
            };

            $scope.init = function () {
                $scope.loadData();
            };


            $scope.obdobiDneNazev = function (udalost) {
                if (udalost.OBDOBI_DNE_OD_NAZEV == udalost.OBDOBI_DNE_DO_NAZEV)
                    return udalost.OBDOBI_DNE_OD_NAZEV;
                else
                    return udalost.OBDOBI_DNE_OD_NAZEV + ' - ' + udalost.OBDOBI_DNE_DO_NAZEV;
            };

            $scope.zdrojeInfo = function (udalost) {
                var nazvySkupin = [];

                var skupiny = udalost.SKUPINY_UDALOSTI;

                for (var i = 0, len = skupiny.length; i < len; i++) {
                    var skupina = skupiny[i];
                    if (skupina.PRIZNAK_DRUH_SKUPINY == 'T')
                        nazvySkupin.push(skupina.TRIDA_NAZEV);
                    else if (skupina.PRIZNAK_DRUH_SKUPINY == 'S')
                        nazvySkupin.push(skupina.TRIDA_NAZEV + ' ' + skupina.SKUPINA_NAZEV);
                    else
                        nazvySkupin.push(skupina.TRIDA_NAZEV + ' (seminář)');
                }


                var nazvyMistnosti = [];

                var mistnosti = udalost.MISTNOSTI_UDALOSTI;

                for (var i = 0, len = mistnosti.length; i < len; i++) {
                    var mistnost = mistnosti[i];
                    nazvyMistnosti.push(mistnost.NAZEV);
                }

                var result = '';
                if (nazvySkupin.length > 0)
                    result = nazvySkupin.join(" + ");

                if (nazvySkupin.length > 0 && nazvyMistnosti.length > 0)
                    result += ', ';

                if (nazvyMistnosti.length > 0)
                    result += nazvyMistnosti.join(" + ");

                return result;
            };


            $scope.loadData = function () {

                if (navigator.network && navigator.network.connection.type === Connection.NONE) {
                    navigator.notification.alert(
                          'Vaše zařízení není připojeno k Interentu. Data nemohou být přijata.',
                          function () { },
                          'Chybí připojení'
                        );

                    return;
                }


                $.mobile.loading("show", {
                    text: "načítám...",
                    textVisible: true,
                    theme: "a",
                    html: ""
                });


                var studentID = null;
                if ($rootScope.shared) {
                    studentID = $rootScope.shared.STUDENT_ID;
                }

                var data = RozvrhService.getByDatumAndOsobaId($scope.selectedDate, studentID);

                data
                    .success(function (result, status, headers, config) {
                        //$log.log("RozvrhCtrl - loadData");

                        //$log.log(result);

                        if (result.Status.Code != "OK") {
                            $scope.data = null;
                            $("#rozvrhNotifier").html(result.Status.Message).popup("open");
                        } else {
                            $scope.data = result.Data.UDALOSTI;

                            $scope.isDataLoaded = true;
                        }

                        $timeout(function () {
                            var table = angular.element('#rozvrhStudent-table');
                            table.listview('refresh');

                            //angular.element('[type="text"]', '#hodnoceni-table').textinput();
                            //angular.element('[type="text"]', table).textinput();
                        }, 0);

                        $.mobile.loading("hide");
                        $('#rozvrhStudentContent').show();

                    })
                    .error(function (error, status, headers, config) {
                        $log.log("ERROR");
                        $log.error(status);

                        if (status == 401) {
                            $timeout(function () { $.mobile.changePage('#login'); }, 0);
                        }


                        $.mobile.loading("hide");
                        $('#rozvrhStudentContent').show();

                    });
            };

            $scope.navigateTo = function (pageIdToChange) {
                $.mobile.pageContainer.pagecontainer('change', pageIdToChange, {
                    transition: 'none', // 
                    reload: true,
                    changeHash: true,
                    reverse: false,
                    showLoadMsg: true
                });

                $scope.reset();
            }

            $scope.showPopupMenu = function (event, udalost, x) {
                //$log.info('popupMenu');
                //$log.debug(event);
                //$log.debug(udalost.UDALOST_ID, udalost.PORADI);
                //$log.debug(x);

                RozvrhService.selectedUdalostID = udalost.UDALOST_ID;
                RozvrhService.selectedUdalostPoradi = udalost.PORADI;
                RozvrhService.selectedDatum = udalost.DATUM;

                $('#popupMenu').popup('open', {
                    transition: 'pop',
                    positionTo: "origin",
                    //x: event.clientX,
                    //y: event.clientY

                    x: event.pageX,
                    y: event.pageY

                });
            }


            $scope.showPopupInfo = function (event, id, x) {
                //$log.info('popupInfo');
                //$log.debug(event);
                //$log.debug(id);
                //$log.debug(x);


                $('#popupInfo').popup('open', {
                    transition: 'pop',
                    positionTo: "origin",
                    //x: event.clientX,
                    //y: event.clientY

                    x: event.pageX,
                    y: event.pageY
                });
            };


            $scope.decrementSelectedDate = function () {
                //$log.info('decrementSelectedDate');
                SelectedDateService.decrementSelectedDate();
                $scope.selectedDate = SelectedDateService.getSelectedDate();
                $scope.selectedDateString = $scope.selectedDate.locale("cs").format("dddd D.M.YYYY");

                $scope.data = {};

                //$scope.loadData();

                $.mobile.changePage("#rozvrhStudent", { transition: "slide", reverse: true, allowSamePageTransition: true });

            }


            $scope.incrementSelectedDate = function () {
                //$log.info('incrementSelectedDate');
                SelectedDateService.incrementSelectedDate();
                $scope.selectedDate = SelectedDateService.getSelectedDate();
                $scope.selectedDateString = $scope.selectedDate.locale("cs").format("dddd D.M.YYYY");

                $scope.data = {};

                ////$timeout(function () {
                ////    var table = angular.element('#rozvrhStudent-table');
                ////    table.listview('refresh');

                ////    //angular.element('[type="text"]', '#hodnoceni-table').textinput();
                ////    //angular.element('[type="text"]', table).textinput();
                ////}, 0);

                //$scope.loadData();

                $.mobile.changePage("#rozvrhStudent", { transition: "slide", allowSamePageTransition: true });

            }

        });

})();
