; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('RozvrhCtrl', function ($scope, $rootScope, $log, $timeout, NastaveniService, SelectedDateService, RozvrhService, ZapisHodnoceniService, ParametryService) {
            //$log.debug('RozvrhCtrl');

        angular.element(document)
            .on("pagecreate", "#rozvrh", function(event, ui) {
                //$log.debug("PAGECREATE - #ROZVRH");
            })
            .on("pagebeforeshow", "#rozvrh", function(event, ui) {
                $('#rozvrhUcitelContent').hide();
            })
            .on("pageshow", "#rozvrh", function(event, ui) {
                //$log.debug("PAGESHOW - #ROZVRH");
                $scope.init();
            });


            //$("#rozvrh").hammer().on("swipeleft", function(event) {
            //    $log.debug("<= SWIPELEFT - #ROZVRH");
            //    $scope.incrementSelectedDate();
            //});

            //$("#rozvrh").hammer().on("swiperight", function (event) {
            //    $log.debug("=> SWIPERIGHT - #ROZVRH");
            //    $scope.decrementSelectedDate();
            //});

            //.on("swipeleft", "#rozvrh", function(event, ui) {
            //    $log.debug("<= SWIPELEFT - #ROZVRH");
            //    $scope.incrementSelectedDate();
                
            //})
            //.on("swiperight", "#rozvrh", function(event, ui) {
            //    $log.debug("=> SWIPERIGHT - #ROZVRH");
            //    $scope.decrementSelectedDate();
            //});

            $scope.timeFormat = NastaveniService.timeFormat;
            $scope.dateFormat = NastaveniService.dateFormat;

            $scope.selectedDate = SelectedDateService.getSelectedDate();
            $scope.selectedDateString = $scope.selectedDate.locale("cs").format("dddd D.M.YYYY");

        $scope.reset = function() {
            $scope.data = {};
        };

        $scope.init = function() {
            $scope.loadData();
        };


        $scope.obdobiDneNazev = function(udalost) {
            if (udalost.OBDOBI_DNE_OD_NAZEV == udalost.OBDOBI_DNE_DO_NAZEV)
                return udalost.OBDOBI_DNE_OD_NAZEV;
            else
                return udalost.OBDOBI_DNE_OD_NAZEV + ' - ' + udalost.OBDOBI_DNE_DO_NAZEV;
        };

        $scope.zdrojeInfo = function(udalost) {
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

                var data = RozvrhService.getByDatum($scope.selectedDate);

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
                            var table = angular.element('#rozvrh-table');
                            table.listview('refresh');

                            //angular.element('[type="text"]', '#hodnoceni-table').textinput();
                            //angular.element('[type="text"]', table).textinput();

                            $.mobile.loading("hide");
                            $('#rozvrhUcitelContent').show();

                        }, 0);

                    })
                    .error(function (error, status, headers, config) {
                        //$log.log("ERROR");
                        $log.error(error);

                        if (status == 401) {
                            $timeout(function () { $.mobile.changePage('#login'); }, 0);
                        }


                        $.mobile.loading("hide");
                        $('#rozvrhUcitelContent').show();

                    });
            };

            $scope.navigateTo = function (pageIdToChange) {
              $.mobile.changePage(pageIdToChange);
/*
                $.mobile.pageContainer.pagecontainer('change', pageIdToChange, {
                    transition: 'none', // 
                    reload: true,
                    changeHash: true,
                    reverse: false,
                    showLoadMsg: true
                });
*/
                $scope.reset();
            }

            $scope.showPopupMenu = function (event, udalost, x) {
                //$log.info('popupMenu');
                //$log.debug(event);
                //$log.debug(udalost.UDALOST_ID, udalost.PORADI);
                //$log.debug(x);

                //alert('detail');

                RozvrhService.selectedUdalostID = udalost.UDALOST_ID;
                RozvrhService.selectedUdalostPoradi = udalost.PORADI;
                RozvrhService.selectedDatum = udalost.DATUM;


                //https://sol.cca.cz/SOLWebApi/api/Parametry/string/TK_DOPREDNY_ZAPIS

                var when = moment(udalost.CAS_OD);
                var now = moment();
                var jeDoprednyZapis = (when > now);

                if (jeDoprednyZapis) {
                    var parametrDoprednyZapis = ParametryService.getStringById('TK_DOPREDNY_ZAPIS');
                    parametrDoprednyZapis.then(function(result) {
                        //$log.log(result);
                        //$log.log(udalost);
                        var povolenDoprednyZapis = (result.data.Data === 'ANO');

                        if (povolenDoprednyZapis) {
                            $('#menuItemZadatDochazku').show();
                        } else {
                            $('#menuItemZadatDochazku').hide();
                        }
                    });

                    $timeout(function() {
                        $('#popupMenu').popup('open', {
                            transition: 'pop',
                            positionTo: "origin",
                            //x: event.clientX,
                            //y: event.clientY

                            x: event.pageX,
                            y: event.pageY

                        });
                    }, 0);


                    //    .then(
                    //    function (povolenDoprednyZapis) {
                    //        $log.log(povolenDoprednyZapis);
                    //        //moment().
                    //        if (povolenDoprednyZapis == "NE") {
                    //            $("#rozvrhNotifier").html("Nemáte povolen zápis .").popup("open");
                    //            return;
                    //        }
                    //    }
                    //);


                } else {
                    $('#menuItemZadatDochazku').show();
                    $timeout(function() {
                        $('#popupMenu').popup('open', {
                            transition: 'pop',
                            positionTo: "origin",
                            //x: event.clientX,
                            //y: event.clientY

                            x: event.pageX,
                            y: event.pageY

                        });

                    }, 0);
                }


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


            function getUdalostWithinTime(time) {
                for (var i = 0, len = $scope.data.length; i < len; i++) {
                    var udalost = $scope.data[i];
                    //$log.debug(SelectedDateService.getLocalDateFromIsoString(udalost.CAS_OD), SelectedDateService.getLocalDateFromIsoString(udalost.CAS_DO));
                    if (SelectedDateService.getLocalDateFromIsoString(udalost.CAS_OD) <= time && SelectedDateService.getLocalDateFromIsoString(udalost.CAS_DO) >= time) {
                        return udalost;
                    }
                }

                return null;
            }


            $scope.zapsatProbiraneUcivo = function (changePage) {
                var now = new Date();

                var udalost = getUdalostWithinTime(now);
                if (udalost) {
                    RozvrhService.selectedUdalostID = udalost.UDALOST_ID;
                    RozvrhService.selectedUdalostPoradi = udalost.PORADI;
                    RozvrhService.selectedDatum = udalost.DATUM;

                    $scope.navigateTo(changePage);
                } else {
                    $("#rozvrhNotifier").html("Nepodařilo se nalézt aktuálně probíhající událost.").popup("open");
                }
            };

            $scope.zapsatDochazku = function (changePage) {
                var now = new Date();

                var udalost = getUdalostWithinTime(now);
                if (udalost) {
                    RozvrhService.selectedUdalostID = udalost.UDALOST_ID;
                    RozvrhService.selectedUdalostPoradi = udalost.PORADI;
                    RozvrhService.selectedDatum = udalost.DATUM;

                    $scope.navigateTo(changePage);
                } else {
                    $("#rozvrhNotifier").html("Nepodařilo se nalézt aktuálně probíhající událost.").popup("open");
                }
            };

            $scope.zapsatHodnoceni = function (changePage) {
                var now = new Date();

                var udalost = getUdalostWithinTime(now);
                if (udalost) {
                    RozvrhService.selectedUdalostID = udalost.UDALOST_ID;
                    RozvrhService.selectedUdalostPoradi = udalost.PORADI;
                    RozvrhService.selectedDatum = udalost.DATUM;

                    $scope.navigateTo(changePage);
                } else {
                    $("#rozvrhNotifier").html("Nepodařilo se nalézt aktuálně probíhající událost.").popup("open");
                }
            };


            $scope.decrementSelectedDate = function () {
                //$log.info('decrementSelectedDate');
                SelectedDateService.decrementSelectedDate();
                $scope.selectedDate = SelectedDateService.getSelectedDate();
                $scope.selectedDateString = $scope.selectedDate.locale("cs").format("dddd D.M.YYYY");

                $scope.data = {};

                $scope.loadData();

                $timeout(function () {
                    $('.ui-btn-active').removeClass('ui-btn-active ui-focus');
                }, 0);


                //$.mobile.changePage("#rozvrh", { transition: "slide", reverse: true, allowSamePageTransition: true });

            }



            $scope.incrementSelectedDate = function () {
                //$log.info('incrementSelectedDate');
                SelectedDateService.incrementSelectedDate();
                $scope.selectedDate = SelectedDateService.getSelectedDate();
                $scope.selectedDateString = $scope.selectedDate.locale("cs").format("dddd D.M.YYYY");

                $scope.data = {};

                $scope.loadData();

                $timeout(function () {
                    $('.ui-btn-active').removeClass('ui-btn-active ui-focus');
                }, 0);


                //$.mobile.changePage("#rozvrh", { transition: "slide", allowSamePageTransition: true });
            }

        });

})();
