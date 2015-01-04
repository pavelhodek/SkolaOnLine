; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('HodnoceniVypisStudentCtrl',
        function ($scope, $rootScope, $log, NastaveniService, SelectedDateService, HodnoceniVypisStudentService) {
            //$log.debug('HodnoceniVypisStudent');

            angular.element(document)
                .on("pagecreate", "#hodnoceniVypisStudent", function (event, ui) {
                    //$log.debug("PAGECREATE - #ROZVRH - STUDENT");
                })
                .on("pageshow", "#hodnoceniVypisStudent", function (event, ui) {
                    //$log.debug("PAGESHOW - #ROZVRH - STUDENT");
                    $scope.init();
                });

            $scope.selectedDateFrom = moment();
            $scope.selectedDateTo = moment();

            $scope.reset = function () {
                $scope.data = {};
            };

            $scope.init = function () {
                $scope.loadData();
            };

            function setSelectedObdobi(selectedValue) {
                $scope.selectedObdobiVypisu = selectedValue;

                if ($scope.selectedObdobiVypisu == "D")
                    $scope.popisObdobi = "den";
                else if ($scope.selectedObdobiVypisu == "W")
                    $scope.popisObdobi = "týden";
                else if ($scope.selectedObdobiVypisu == "M")
                    $scope.popisObdobi = "měsíc";
                else if ($scope.selectedObdobiVypisu == "3M")
                    $scope.popisObdobi = "3 měsíce";
                else if ($scope.selectedObdobiVypisu == "S")
                    $scope.popisObdobi = "pololetí";
            }

            $scope.loadData = function () {
                
                setSelectedObdobi("D");

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

                var data = HodnoceniVypisStudentService.getAllOfCurrentSemester();

                data
                    .success(function (result, status, headers, config) {
                        //$log.log("RozvrhCtrl - loadData");

                        //$log.log(result);

                        if (result.Status.Code != "OK") {
                            $scope.data = null;
                            $("#hodnoceniVypisStudentNotifier").html(result.Status.Message).popup("open");
                        } else {
                            $scope.data = result.Data.Hodnoceni;

                            $scope.isDataLoaded = true;
                        }

                        setTimeout(function () {
                            var table = angular.element('#hodnoceniVypisStudent-table');
                            table.listview('refresh');

                            //angular.element('[type="text"]', '#hodnoceni-table').textinput();
                            //angular.element('[type="text"]', table).textinput();
                        }, 0);

                        $.mobile.loading("hide");

                    })
                    .error(function (error, status, headers, config) {
                        $log.log("ERROR");
                        $log.error(status);

                        if (status == 401) {
                            setTimeout(function () { $.mobile.changePage('#login'); }, 0);
                        }


                        $.mobile.loading("hide");

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


            $scope.decrementSelectedDate = function () {
                //$log.info('decrementSelectedDate');
                SelectedDateService.decrementSelectedDate();
                $scope.selectedDate = SelectedDateService.getSelectedDate();

                $scope.data = {};

                $scope.loadData();
            }

            $scope.incrementSelectedDate = function () {
                //$log.info('incrementSelectedDate');
                SelectedDateService.incrementSelectedDate();
                $scope.selectedDate = SelectedDateService.getSelectedDate();

                $scope.data = {};

                setTimeout(function () {
                    var table = angular.element('#rozvrhStudent-table');
                    table.listview('refresh');

                    //angular.element('[type="text"]', '#hodnoceni-table').textinput();
                    //angular.element('[type="text"]', table).textinput();
                }, 0);

                $scope.loadData();

            };


            $scope.vyberObdobiVypisu = function () {
                $log.info("vyberObdobiVypisu");
                $("#hodnoceniVypisStudentObdobiPopup").popup("open");

                setTimeout(function () {
                    $("input[type='radio']").checkboxradio();
                    $("input[type='radio']").checkboxradio("refresh");
                }, 0);

            };

            $scope.nastavObdobiVypisu = function (selectedValue) {
                setSelectedObdobi(selectedValue);
                $("#hodnoceniVypisStudentObdobiPopup").popup("close");
            }

        });

})();