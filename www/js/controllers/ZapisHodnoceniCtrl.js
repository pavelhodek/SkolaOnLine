; (function () {
    "use strict";
    angular.module('sol.controllers').controller('ZapisHodnoceniCtrl', function ($scope, $rootScope, $log, $q, ZapisHodnoceniService, DruhyHodnoceniService, RozvrhService, TridyService, ObdobiDneService, UdalostService, ObdobiRokuService, StupniceHodnoceniService, ParametryService) {
        //$log.debug('ZapisHodnoceniCtrl');

        angular.element(document)
            .on("pagecreate", "#hodnoceni", function (event, ui) {
                //$log.debug("PAGECREATE - #HODNOCENI");
            })
            .on("pageshow", "#hodnoceni", function (event, ui) {
                //$log.debug("PAGESHOW - #HODNOCENI");
                $scope.reset();
                $scope.loadData();
            });


        $scope.reset = function () {
            $scope.data = {};
            $scope.isDataLoaded = false;
            $scope.posledniEditovanyStudentIndex = null;
            $scope.isHodnoceniProcenty = false;
            $scope.isHodnoceniZnamkami = true;
            $scope.isHodnoceniProcenty = false;
            $scope.isHodnoceniDruhVysledkuVyber = false;
            $scope.druhVysledku = "Z";
            $scope.submitted = false;
            $scope.hodnoceniForm.$setPristine();

            $('#hodnoceniDruh').selectmenu('refresh');
        };


        $scope.loadData = function () {
            //$log.log("ZapisHodnoceniCtrl - loadData");

            $scope.UdalostID = RozvrhService.selectedUdalostID;
            $scope.UdalostPoradi = RozvrhService.selectedUdalostPoradi;

            var hodnoceni = ZapisHodnoceniService.getByRozvrhovaUdalost($scope.UdalostID, $scope.UdalostPoradi);
            var druhyHodnoceni = DruhyHodnoceniService.all();
            var tridy = TridyService.all();
            var obdobiRoku = ObdobiRokuService.all();
            var stupniceHodnoceni = StupniceHodnoceniService.all();
            var parametrHodnoceni = ParametryService.getStringById("ZPUSOB_HODNOCENI");

            // pockam na vsechny promise
            $q.all([hodnoceni, druhyHodnoceni, tridy, obdobiRoku, stupniceHodnoceni, parametrHodnoceni]).then(function (results) {
                //$log.log("ZapisHodnoceniCtrl - all resloved");

                var hodnoceni = results[0].data.Data;
                var druhyHodnoceni = results[1].data.Data;
                var tridy = results[2].data.Data;
                var obdobiRoku = results[3].data.Data;
                var stupniceHodnoceni = results[4].data.Data;
                var parametrHodnoceni = results[5].data.Data;

                $scope.isHodnoceniZnamkami = (parametrHodnoceni == "ZNAMKA");
                $scope.isHodnoceniProcenty = (parametrHodnoceni == "PROCENTA");
                $scope.isHodnoceniDruhVysledkuVyber = (parametrHodnoceni == "ZNAMKAPROCENTA");
                $scope.druhVysledku = "Z";

                UdalostService.getPopisHodiny($scope.UdalostID, $scope.UdalostPoradi).then(
                    function (result) {
                        $scope.popisHodiny = result.data;
                    },
                    function (error) {
                        $scope.popisHodiny = '';
                    }
                    );

                angular.forEach(hodnoceni.Studenti, function (value, key, object) {
                    //$log.debug(value);
                    angular.extend(value, {
                        TRIDA_NAZEV: nazevTridy(tridy, value.TRIDA_ID),
                        VYSLEDEK_ZNAMKA: '',
                        VYSLEDEK_PROCENTA: null
                    });
                });


                hodnoceni.Studenti.sort(function (a, b) {
                    var order = (a.TRIDA_PORADI || 0) - (b.TRIDA_PORADI || 0);

                    if (order != 0) {
                        return order;
                    }

                    order = (a.TRIDA_NAZEV || "").localeCompare(b.TRIDA_NAZEV || "");
                    if (order != 0) {
                        return order;
                    }

                    order = (a.PRIJMENI || "").localeCompare(b.PRIJMENI || "");
                    if (order != 0) {
                        return order;
                    }

                    order = (a.JMENO || "").localeCompare(b.JMENO || "");
                    if (order != 0) {
                        return order;
                    }

                    order = (a.CVTV || 0) - (b.CVTV || 0);
                    if (order != 0) {
                        return order;
                    }

                    return order;
                });


                stupniceHodnoceni.push({ HODNOTA: "-" });
                stupniceHodnoceni.push({ HODNOTA: "" });

                hodnoceni.DruhyHodnoceni = druhyHodnoceni;
                hodnoceni.ObdobiRoku = obdobiRoku;
                hodnoceni.StupniceHodnoceni = stupniceHodnoceni;

                hodnoceni.Hodnoceni = {};
                hodnoceni.Hodnoceni.OBDOBI_ID_P = findObdobiRokuByDate(obdobiRoku, RozvrhService.selectedDatum).OBDOBI_ID;

                $scope.data = hodnoceni;

                $scope.isDataLoaded = true;

                setTimeout(function () {
                    var table = angular.element('#hodnoceni-table');
                    table.table('refresh');
                    angular.element('[type="text"]', table).textinput();
                }, 0);


                setTimeout(function () {
                    angular.element('[type="number"]').textinput();
                }, 0);

                setTimeout(function () {
                    var hodnoceniPololeti = angular.element('#hodnoceniPololeti');
                    hodnoceniPololeti.selectmenu('refresh');
                    //$log.debug("hodnoceniPololeti - REFRESH 2");
                }, 0);

                setTimeout(function () {
                    var hodnoceniDruh = angular.element('#hodnoceniDruh');
                    hodnoceniDruh.selectmenu('refresh');
                    //$log.debug("hodnoceniDruh - REFRESH 2");
                }, 0);

                setTimeout(function () {
                    //var table = angular.element('#hodnoceni-table');
                    //table.table('refresh');
                    angular.element('[type="radio"]').checkboxradio();
                    angular.element('[type="radio"]').checkboxradio("refresh");
                }, 0);


            },
            function (error) {
                $log.error(error);
            });

        };

        $scope.stupenHodnoceniText = function (hodnota) {
            if (hodnota == null || hodnota == '') {
                return 'nezadáno';
            } else if (hodnota == '-') {
                return 'nehodnocen (-)';
            } else {
                return hodnota;
            }
        }

        $scope.nazevStudenta = function (student) {
            return (student.PRIJMENI || '') + ' ' + (student.JMENO || '');
        };

        $scope.nazevDruhuHodnoceni = function (druhHodnoceni) {
            return DruhyHodnoceniService.formatNazevVaha(druhHodnoceni);
        };


        $scope.zpet = function () {
            //$log.info('zpet');
            navigateToRozvrh();
        }

        $scope.ulozit = function () {
            //$log.info('ulozit');

            $scope.submitted = true;

            if ($scope.hodnoceniForm.$invalid) {
                //$("#hodnoceniNotifier").html("Zadání není validní.").popup("open");
                //$log.warn('nebylo uloženo');
                //$log.debug($scope.hodnoceniForm);
                return;
            }

            var status = ZapisHodnoceniService.save(zadaneHodnoceni());

            status.then(function (result) {
                if (result.data.Code == "OK") {
                    //$log.info('ZapisHodnoceni - SAVED');
                    navigateToRozvrh();
                    $("#rozvrhNotifier").html("Hodnocení uloženo.").popup("open");
                } else if (result.data.Code == "ERROR") {
                    //$log.error("ZapisHodnoceni - ERROR: " + result.data.Message);
                    $("#hodnoceniNotifier").html("Nepodařilo se uložit. <br>" + result.data.Message).popup("open");
                }
            });
        };

        $scope.ulozitAPodobne = function () {
            //$log.info('ulozitAPodobne');

            $scope.submitted = true;

            if ($scope.hodnoceniForm.$invalid) {
                //$("#hodnoceniNotifier").html("Zadání není validní.").popup("open");
                //$log.warn('nebylo uloženo');
                //$log.debug($scope.hodnoceniForm);
                return;
            }

            var status = ZapisHodnoceniService.save(zadaneHodnoceni());

            status.then(function (result) {
                if (result.data.Code == "OK") {
                    //$log.info('ZapisHodnoceni - SAVED');
                    $("#hodnoceniNotifier").html("Hodnocení uloženo.").popup("open");

                    //$scope.reset();
                    clearVysledek();
                    $scope.data.Hodnoceni.NAZEV = null;
                    $scope.data.Hodnoceni.POPIS = null;
                    $scope.submitted = false;
                    $scope.hodnoceniForm.$setPristine();

                } else if (result.data.Code == "ERROR") {
                    $log.error("ZapisHodnoceni - ERROR: " + result.data.Message);
                    $("#hodnoceniNotifier").html("Nepodařilo se uložit. <br>" + result.data.Message).popup("open");
                }
            });
        };


        function navigateToRozvrh() {
            $.mobile.changePage('#rozvrh', 'slide', true, true);
            $scope.reset();
        }


        function zadaneHodnoceni() {
            var result = {};
            result.Udalost = {
                NAZEV: $scope.data.Hodnoceni.NAZEV,
                POPIS: $scope.data.Hodnoceni.POPIS,
                DRUH_UDALOSTI_ID: $scope.data.Hodnoceni.DRUH_UDALOSTI_ID,
                REALIZACE_ID: $scope.data.Udalost.REALIZACE_ID,
                OBDOBI_ID_R: $scope.data.Udalost.OBDOBI_ID_R,
                OBDOBI_ID_P: $scope.data.Udalost.OBDOBI_ID_P,
                DATUM: $scope.data.Udalost.DATUM,
                OBDOBI_DNE_OD_ID: $scope.data.Udalost.OBDOBI_DNE_OD_ID
            };

            result.Hodnoceni = [];

            $scope.data.Studenti.forEach(function (student, studentIndex, studentArray) {
                result.Hodnoceni[result.Hodnoceni.length] = {
                    "OSOBA_ID": student.OSOBA_ID,
                    "DRUH_VYSLEDKU": $scope.druhVysledku,
                    "VYSLEDEK": ($scope.druhVysledku == "Z") ? student.VYSLEDEK_ZNAMKA : student.VYSLEDEK_PROCENTA,
                    "VYSLEDEK_TEXT": student.VYSLEDEK_TEXT
                };
            });

            return result;
        }



        // ------------------

        function nazevTridy(tridy, id) {
            for (var i = 0, len = tridy.length; i < len; i++) {
                if (tridy[i].SKUPINA_ID == id) {
                    return tridy[i].NAZEV;
                }
            }

            return '';
        }


        function findObdobiRokuByDate(obdobiRoku, date) {
            for (var i = 0, len = obdobiRoku.length; i < len; i++) {
                if (obdobiRoku[i].DATUM_OD <= date && obdobiRoku[i].DATUM_DO >= date) {
                    return obdobiRoku[i];
                }
            }

            if (obdobiRoku.length > 0) {
                if (date < obdobiRoku[0].DATUM_OD) return obdobiRoku[0];
                if (date > obdobiRoku[obdobiRoku.length - 1].DATUM_DO) return obdobiRoku[obdobiRoku.length - 1];
            }

            return null;
        }


        $scope.posledniEditovanyStudentIndex = null;
        $scope.hodnoceniNastavitVsem = false;
        $scope.vybranaZnamka = null;

        $scope.prepniHodnoceni = function (student, indexStudenta, event) {
            //$log.debug('prepniHodnoceni');
            $scope.hodnoceniNastavitVsem = false;
            // kvuli jqm extenzim je treba refresh
            setTimeout(function () {
                $("#hodnoceniNastavitVsem").checkboxradio("refresh");
            }, 0);

            $scope.vybranaZnamka = student.VYSLEDEK_ZNAMKA;

            $("#hodnoceniVyberPopup").popup("open", {
                transition: "pop",
                positionTo: "origin",
                //x: event.clientX,
                //y: event.clientY

                x: event.pageX,
                y: event.pageY

            });

            $scope.posledniEditovanyStudentIndex = indexStudenta;
            setTimeout(function () {
                $("input[type='radio']").checkboxradio();
                $("input[type='radio']").checkboxradio("refresh");
            }, 0);
        };

        $scope.nastavHodnoceni = function (vysledek) {
            //$log.info('nastavHodnoceni');

            if ($scope.hodnoceniNastavitVsem) {
                for (var i = 0, len = $scope.data.Studenti.length; i < len; i++) {
                    $scope.data.Studenti[i].VYSLEDEK_ZNAMKA = vysledek;
                }
            } else {
                var student = $scope.data.Studenti[$scope.posledniEditovanyStudentIndex];
                student.VYSLEDEK_ZNAMKA = vysledek;
            }


            $("#hodnoceniVyberPopup").popup("close");
        };


        $scope.nastavDruhVysledku = function (druh) {
            //$log.debug("nastavDruhVysledku");

            // prepnuti druhu musi smazat doposud zadana data
            clearVysledek();
        };


        function clearVysledek() {
            for (var i = 0, len = $scope.data.Studenti.length; i < len; i++) {
                $scope.data.Studenti[i].VYSLEDEK_ZNAMKA = '';
                $scope.data.Studenti[i].VYSLEDEK_PROCENTA = null;
                $scope.data.Studenti[i].VYSLEDEK_TEXT = null;
            }
        }

    });

})();