(function () {
    'use strict';

    var app = angular
        .module('app', ['ui.router', 'ngCookies', 'ngAnimate', 'ngSanitize', 'ui.bootstrap'])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {

        // For any unmatched url, send to /route1
        $urlRouterProvider.when('', '/home');
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('authenticated', {
                url: "/home",
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })
            .state('unauthenticated', {
                controller: 'LoginController',
                templateUrl: 'shared/unauthenticated.view.html',
                controllerAs: 'vm'
            })
            .state('unauthenticated.login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })
            .state('unauthenticated.register', {
                url: '/register',
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            });
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http', '$state'];
    function run($rootScope, $location, $cookies, $http, $state) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Token ' + $rootScope.globals.currentUser.token;
        }
    }

    app.controller('main', ['$rootScope', '$location', '$state',
        function($rootScope, $location, $state){
            $rootScope.$on('$locationChangeSuccess', function (event, next, current) {
                // redirect to login page if not logged in and trying to access a restricted page
                var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
                var loggedIn = $rootScope.globals.currentUser;
                if (restrictedPage && !loggedIn) {
                    $state.transitionTo('unauthenticated.login');
                }
            });
        }]);
})();