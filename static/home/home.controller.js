(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['CoursesService', '$rootScope', 'AuthenticationService', '$location'];
    function HomeController(CoursesService, $rootScope, AuthenticationService, $location) {
        var vm = this;

        vm.logout = logout;

        initController();

        function initController() {
            CoursesService.GetAll()
        }

        function logout(){
            AuthenticationService.Logout(function(){
                $location.path('/');
            });
        }

    }

})();