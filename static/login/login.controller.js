(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.GetNewToken(function (response) {
                if (response.status === 'success') {
                    $location.path('/');
                }
            });
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.status === 'success') {
                    $location.path('/');
                } else {
                    FlashService.Error('Invalid Username or Password');
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
