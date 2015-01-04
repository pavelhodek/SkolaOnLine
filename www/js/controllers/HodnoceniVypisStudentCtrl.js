; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('HodnoceniVypisStudentCtrl',
        function ($scope, $rootScope, $log, $q, NastaveniService, SelectedDateService, HodnoceniVypisStudentService, DruhyHodnoceniService, PredmetyService) {
            //$log.debug('HodnoceniVypisStudent');

            angular.element(document)
                .on("pagecreate", "#hodnoceniVypisStudent", function (event, ui) {
                    //$log.debug("PAGECREATE - #ROZVRH - STUDENT");
                })
                .on("pageshow", "#hodnoceniVypisStudent", function (event, ui) {
                    //$log.debug("PAGESHOW - #ROZVRH - STUDENT");
                    $scope.init();
                });


            $scope.reset = function () {
                $scope.data = {};
                var now = moment();
                $scope.selectedDateFrom = now.startOf('isoweek');
                $scope.selectedDateTo = now.endOf('isoweek');
            };

            $scope.init = function () {
                setSelectedObdobi("W");
                $scope.loadData();
            };

            function setSelectedObdobi(selectedValue) {
                $scope.selectedObdobiVypisu = selectedValue;
                var now = moment().locale("cs");

                if ($scope.selectedObdobiVypisu == "D") {
                    $scope.popisObdobi = "den";
                    $scope.selectedDateFrom = now.startOf('day');
                    $scope.selectedDateTo = now.endOf('day');
                } else if ($scope.selectedObdobiVypisu == "W") {
                    $scope.selectedDateFrom = now.startOf('isoweek');
                    $scope.selectedDateTo = now.endOf('isoweek');

                    $scope.popisObdobi = "týden";
                } else if ($scope.selectedObdobiVypisu == "M") {
                    $scope.selectedDateFrom = now.startOf('month');
                    $scope.selectedDateTo = now.endOf('month');
                    $scope.popisObdobi = "měsíc";
                } else if ($scope.selectedObdobiVypisu == "3M") {
                    $scope.selectedDateFrom = now.startOf('month').add(-2, "M");
                    $scope.selectedDateTo = now.endOf('month');
                    $scope.popisObdobi = "3 měsíce";
                } else if ($scope.selectedObdobiVypisu == "S") {
                    $scope.popisObdobi = "pololetí";
                    $scope.selectedDateFrom = moment("1900-01-01");
                    $scope.selectedDateTo = moment("3000-01-01");
                }
            }

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

                var hodnoceni = HodnoceniVypisStudentService.getAllOfCurrentSemester();
                var druhyHodnoceni = DruhyHodnoceniService.all();
                var predmety = PredmetyService.all();

            // pockam na vsechny promise
            $q.all([hodnoceni, druhyHodnoceni, predmety]).then(function (results) {
                //$log.log("ZapisHodnoceniCtrl - all resloved");

                var hodnoceni = results[0].data.Data;
                var druhyHodnoceni = results[1].data.Data;
                var predmety = results[2].data.Data;
                $log.log(druhyHodnoceni);

                var data = {};

                data.Predmety = _(predmety)
                    //.map(function (x) { return { TRIDA_ID: x.TRIDA_ID, TRIDA_NAZEV: x.TRIDA_NAZEV, TRIDA_PORADI_ZOBRAZENI: x.TRIDA_PORADI_ZOBRAZENI }; })
                    //.uniq(function (x) { return x.TRIDA_ID; })
                    .sortBy(function (x) { return x.NAZEV; })
                    .sortBy(function (x) { return x.PORADI_ZOBRAZENI; }).value();

                data.Hodnoceni = _(hodnoceni.Hodnoceni)
                                    //.map(function (x) { return { TRIDA_ID: x.TRIDA_ID, TRIDA_NAZEV: x.TRIDA_NAZEV, TRIDA_PORADI_ZOBRAZENI: x.TRIDA_PORADI_ZOBRAZENI }; })
                                    //.uniq(function (x) { return x.TRIDA_ID; })
                                    .sortBy(function (x) { return x.OBDOBI_DNE_ID; })
                                    .sortBy(function (x) { return x.DATUM; }).reverse().value();

                _(data.Hodnoceni).forEach(function (hodn, i, x) {
                    //$log.log(hodn.NAZEV, i, x);
                    //if (i == 5) return false; // break

                    if (moment(hodn.DATUM) < $scope.selectedDateFrom) {
                        return false;
                    }

                    var predmet = _(data.Predmety).find(function (p) {
                        return p.REALIZACE_ID == hodn.REALIZACE_ID
                    });

                    var druhHodnoceni = _(druhyHodnoceni).find(function (p) {
                        return p.DRUH_UDALOSTI_ID == hodn.DRUH_UDALOSTI_ID
                    });

                    if (predmet) {
                        if (!predmet.HODNOCENI) {
                            predmet.HODNOCENI = [];
                            predmet.POCET_HODNOCENI = 0;
                            predmet.POSLEDNI_HODNOCENI = null;
                        }

                        if (!predmet.POSLEDNI_HODNOCENI) {
                            predmet.POSLEDNI_HODNOCENI = hodn.DATUM;
                        }

                        predmet.POCET_HODNOCENI = predmet.POCET_HODNOCENI + 1;
                        predmet.HODNOCENI[predmet.HODNOCENI.length] = {
                            VYSLEDEK: hodn.VYSLEDEK,
                            DRUH_VYSLEDKU: hodn.DRUH_VYSLEDKU,
                            NAZEV: hodn.NAZEV,
                            DRUH_HODNOCENI: (druhHodnoceni ? druhHodnoceni.NAZEV : null),
                            VAHA: (druhHodnoceni ? druhHodnoceni.VAHA : null),
                            DATUM: hodn.DATUM
                        };

                    }


                });


                $log.log(data.Predmety);
                $log.log(data.Hodnoceni);

                $scope.predmety = _(data.Predmety).filter(function (x) { return x.HODNOCENI }).value();

                $scope.data = hodnoceni.Hodnoceni;

                $scope.isDataLoaded = true;

                

                setTimeout(function () {
                    var table = angular.element('#hodnoceniVypisStudent-table');
                    table.listview('refresh');

                    var table2 = angular.element('.hodnoceniVypisStudentList');

                    $('[data-role=collapsible]').collapsibleset().trigger('create');

                    //$('#myList').listview('refresh');
                    //$('#myList').find('li[data-role=collapsible]').collapsible({ refresh: true });
                    $('[data-role=collapsible]').collapsible({ refresh: true });

                    //table2.collapsible();
                    //table2.collapsibleset("refresh")
                    //table2.listview('refresh');

                    //angular.element('[type="text"]', '#hodnoceni-table').textinput();
                    //angular.element('[type="text"]', table).textinput();
                }, 0);

                $.mobile.loading("hide");

            },
                    function (error) {
                        $.mobile.loading("hide");
                        $log.error(error);
                        $scope.data = null;
                        $("#hodnoceniVypisStudentNotifier").html(result.Status.Message).popup("open");
                    });
/*
                hodnoceni
                    .success(function (result, status, headers, config) {
                        $log.log("RozvrhCtrl - loadData");

                        $log.log(result);

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
                    */

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
                $scope.loadData();
            }

        });

})();