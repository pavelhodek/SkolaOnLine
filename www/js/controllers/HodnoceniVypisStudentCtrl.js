; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('HodnoceniVypisStudentCtrl',
        function ($scope, $rootScope, $log, $q, $timeout, NastaveniService, SelectedDateService, HodnoceniVypisStudentService, DruhyHodnoceniService, PredmetyService) {
            //$log.debug('HodnoceniVypisStudent');

            angular.element(document)
                .on("pagecreate", "#hodnoceniVypisStudent", function (event, ui) {
                    //$log.debug("PAGECREATE - #ROZVRH - STUDENT");
                })
                .on("pagebeforeshow", "#hodnoceniVypisStudent", function (event, ui) {
                    $('#hodnoceniVypisStudentContent').hide();
                })
                .on("pageshow", "#hodnoceniVypisStudent", function (event, ui) {
                    //$log.debug("PAGESHOW - #ROZVRH - STUDENT");
                    //$log.debug('This page was just hidden: ', ui.prevPage);
                    $scope.init();
                    //if (ui.prevPage[0].id != 'hodnoceniDetail') {
                    //    $scope.init();
                    //}
                
                });


            $scope.reset = function () {
                $scope.data = {};
                //var now = moment();
                //$scope.selectedDateFrom = now.clone().startOf('isoweek');
                //$scope.selectedDateTo = now.clone().endOf('isoweek');
            };

            $scope.init = function () {

                var now = moment().locale("cs");
                $scope.sledovaneObdobi = [
                    {
                        ID: "D", Title: "Dnes",
                        Description: now.clone().format('D. M.'),
                        DateFrom: now.clone().startOf('day'),
                        DateTo: now.clone().endOf('day'),
                    },
                    {
                        ID: "W", Title: "Poslední týden",
                        Description: "od " + now.clone().startOf('isoweek').format('D. M.') + ' do ' + now.clone().format('D. M.'),
                        DateFrom: now.clone().startOf('isoweek'),
                        DateTo: now.clone(),
                    },
                    {
                        ID: "M", Title: "Poslední měsíc",
                        Description: "od " + now.clone().startOf('month').format('D. M.') + ' do ' + now.clone().format('D. M.'),
                        DateFrom: now.clone().startOf('month'),
                        DateTo: now.clone(),
                    },
                    {
                        ID: "3M", Title: "Poslední 3 měsíce",
                        Description: "od " + now.clone().startOf('month').add(-2, "M").format('D. M.') + ' do ' + now.clone().format('D. M.'),
                        DateFrom: now.clone().startOf('month').add(-2, "M"),
                        DateTo: now.clone(),
                    },
                    {
                        ID: "S", Title: "Celé pololetí",
                        Description: "za celé pololetí",
                        DateFrom: moment("1900-01-01"),
                        DateTo: now.clone(),
                    }
                ];

                $scope.sledovaneObdobiSelected = null;


                setSelectedObdobi("W");
                $scope.loadData(true);
            };


            function setSelectedObdobi(selectedValue) {
                $scope.selectedObdobiVypisu = selectedValue;


                var obdobi = _($scope.sledovaneObdobi).find(function (x) {
                    return x.ID == selectedValue;
                });

                if (obdobi) {
                    $scope.selectedDateFrom = obdobi.DateFrom;
                    $scope.selectedDateTo = obdobi.DateTo;
                    $scope.popisObdobi = obdobi.Description;
                }
            }

            $scope.loadData = function (isInitialLoad) {

                if (navigator.network && navigator.network.connection.type === Connection.NONE) {
                    navigator.notification.alert(
                          'Vaše zařízení není připojeno k Internetu. Data nemohou být přijata.',
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

                var hodnoceni = HodnoceniVypisStudentService.getAllOfCurrentSemester(studentID);
                var druhyHodnoceni = DruhyHodnoceniService.all();
                var predmety = PredmetyService.all();

                // pockam na vsechny promise
                $q.all([hodnoceni, druhyHodnoceni, predmety]).then(function (results) {
                    //$log.log("ZapisHodnoceniCtrl - all resloved");

                    var hodnoceni = results[0].data.Data;
                    var druhyHodnoceni = results[1].data.Data;
                    var predmety = results[2].data.Data;
                    //$log.log(druhyHodnoceni);

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

                    // pokud je nejnovejsi hodnoceni imo sledovane obdobi, pak uprav sledovane obdobi
                    if (isInitialLoad && data.Hodnoceni.length > 0) {

                        var datum = moment(data.Hodnoceni[0].DATUM);
                        //$log.log(datum, $scope.selectedDateFrom);

                        if (datum < $scope.selectedDateFrom) {
                            //$log.log('KOREKCE SLEDOVANEHO OBDOBI');
                            var obdobi = _($scope.sledovaneObdobi).find(function (x) { return x.DateFrom <= datum; });
                            if (obdobi) {
                                setSelectedObdobi(obdobi.ID);
                            }
                        }
                    }
                
                        
                    _(data.Hodnoceni).forEach(function (hodn, i, x) {
                        //$log.log(hodn.NAZEV, i, x);
                        //if (i == 5) return false; // break

                        if (moment(hodn.DATUM) < $scope.selectedDateFrom) {
                            return false;
                        }

                        var predmet = _(data.Predmety).find(function (p) {
                            return p.REALIZACE_ID == hodn.REALIZACE_ID;
                        });

                        var druhHodnoceni = _(druhyHodnoceni).find(function (p) {
                            return p.DRUH_UDALOSTI_ID == hodn.DRUH_UDALOSTI_ID;
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

                            var vysledek = (hodn.VYSLEDEK != null) ? hodn.VYSLEDEK : ((hodn.VYSLEDEK_TEXT != null) ? 'S' : '-');


                            predmet.HODNOCENI[predmet.HODNOCENI.length] = {
                                VYSLEDEK: vysledek,
                                DRUH_VYSLEDKU: hodn.DRUH_VYSLEDKU,
                                NAZEV: hodn.NAZEV,
                                DRUH_HODNOCENI: (druhHodnoceni ? druhHodnoceni.NAZEV : null),
                                VAHA: (druhHodnoceni ? druhHodnoceni.VAHA.toString().replace('.', ',') : null),
                                DATUM: hodn.DATUM
                            };

                        }


                    });


                    //$log.log(data.Predmety);
                    //$log.log(data.Hodnoceni);

                    $scope.predmety = _(data.Predmety).filter(function (x) { return x.HODNOCENI; }).value();

                    $scope.data = hodnoceni.Hodnoceni;

                    $scope.isDataLoaded = true;



                    $timeout(function () {
                        var table = angular.element('#hodnoceniVypisStudent-table');
                        table.listview('refresh');

                        var table2 = angular.element('.hodnoceniVypisStudentList');

                        $('[data-role=collapsible]').collapsibleset().trigger('create');

                        //$('#myList').listview('refresh');
                        //$('#myList').find('li[data-role=collapsible]').collapsible({ refresh: true });
                        $('[data-role=collapsible]').collapsible({ refresh: true });

                    }, 0);

                    $.mobile.loading("hide");
                    $('#hodnoceniVypisStudentContent').show();
                },
                function (error) {
                    $.mobile.loading("hide");
                    $('#hodnoceniVypisStudentContent').show();
                    $log.error(error);
                    $scope.data = null;
                    $("#hodnoceniVypisStudentNotifier").html(result.Status.Message).popup("open");
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


            $scope.vyberObdobiVypisu = function () {
                //$log.info("vyberObdobiVypisu");
                $("#hodnoceniVypisStudentObdobiPopup").popup("open");

                $timeout(function () {
                    $("input[type='radio']").checkboxradio();
                    $("input[type='radio']").checkboxradio("refresh");
                }, 0);

            };


            $scope.nastavObdobiVypisu = function(selectedValue) {
                setSelectedObdobi(selectedValue);
                $("#hodnoceniVypisStudentObdobiPopup").popup("close");

                $timeout(function () {
                    $("input[type='radio']").checkboxradio();
                    $("input[type='radio']").checkboxradio("refresh");
                }, 0);


                $scope.loadData();
            };


            $scope.showDetail = function(event, hodnoceni) {
                $.mobile.pageContainer.pagecontainer('change', '#hodnoceniDetail', {
                    transition: 'none',
                    ajax: false
                    //changeHash: false
                    //role: 'dialog',
                    //reload: false,
                    //changeHash: true,
                    //reverse: false,
                    //showLoadMsg: false
                });

                //$('#hodnoceniDetail').popup();
                //$('#hodnoceniDetail').popup('open');


            }

        });

})();