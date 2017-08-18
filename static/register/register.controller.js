(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['AuthenticationService', '$location', '$rootScope', 'FlashService', '$state'];
    function RegisterController(AuthenticationService, $location, $rootScope, FlashService, $state) {
        var vm = this;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            AuthenticationService.Register(vm.user, function (response) {
                    if (response.status === 'success') {
                        FlashService.Success('Registration successful', true);
                        $location.path('/');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();
