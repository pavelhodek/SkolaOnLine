; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('HodnoceniDetailCtrl',
        function ($scope, $rootScope, $log, $q, $timeout, NastaveniService, HodnoceniVypisStudentService, HodnoceniDetailService) {
            //$log.debug('hodnoceniDetail');
            $.mobile.page.prototype.options.domCache = true;
            angular.element(document)
                .on("pagecreate", "#hodnoceniDetail", function (event, ui) {
                    //$log.debug("PAGECREATE - #hodnoceniDetail");
                })
                .on("pagebeforeshow", "#hodnoceniDetail", function (event, ui) {
                    $('#hodnoceniVypisStudentContent').hide();
                })
                .on("pageshow", "#hodnoceniDetail", function (event, ui) {
                    //$log.debug("PAGESHOW - #hodnoceniDetail");
                    $scope.init();
                });


            $scope.reset = function () {
                $scope.hodnoceni = {};
            };

            $scope.init = function () {
                $scope.hodnoceni = {};
                $scope.loadData(true);
            };



            $scope.loadData = function(isInitialLoad) {

                if (navigator.network && navigator.network.connection.type === Connection.NONE) {
                    navigator.notification.alert(
                        'Vaše zařízení není připojeno k Internetu. Data nemohou být přijata.',
                        function() {},
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

                var hodnoceni = HodnoceniDetailService.getHodnoceniDetail(UdalostID, studentID);

                hodnoceni.then(function(success) {
                    
                }, function(error) {
                    
                });



                $scope.hodnoceni.PREDMET = 'matematika';
                //$scope.apply();

                $.mobile.loading("hide");
            }


            //$scope.navigateTo = function (pageIdToChange) {
            //    $.mobile.pageContainer.pagecontainer('change', pageIdToChange, {
            //        transition: 'none', // 
            //        reload: true,
            //        changeHash: true,
            //        reverse: false,
            //        showLoadMsg: true
            //    });

            //    $scope.reset();
            //}

            $scope.close = function() {
                $log.debug('CLOSE');
                $("#hodnoceniDetail").dialog("close");
                //$('[data-role=dialog]').dialog("close");
                //$("#hodnoceniDetail").popup("close");
            }

        });

})();