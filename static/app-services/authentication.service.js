(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope'];
    function AuthenticationService($http, $cookies, $rootScope) {
        var service = {};

        service.Login = Login;
        service.Register = Register;
        service.Logout = Logout;
        service.SetToken = SetToken;
        service.ClearCredentials = ClearCredentials;
        service.GetNewToken = GetNewToken;

        return service;

        function Login(username, password, callback) {
            $http.post('/api/v1/auth/login', { username: username, password: password })
               .then(function (response) {
                   if(response.status === 200 && response.data.status === 'success' && response.data.token){
                       SetToken(response.data.token);
                   }
                   callback(response.data);
               });
        }

        function Register(user, callback) {
            $http.post('/api/v1/auth/register', user)
               .then(function (response) {
                   if(response.status === 200 && response.data.status === 'success' && response.data.token){
                       SetToken(response.data.token);
                   }
                   callback(response.data);
               });
        }

        function Logout(callback) {
            ClearCredentials();
            $http({ method: 'DELETE', url: '/api/v1/auth/token' })
               .then(function (response) {
                   callback(response.data);
               }, function(response){
                   callback(response.data);
               });
        }

        function GetNewToken(callback){
            $http.get('/api/v1/auth/token')
               .then(function (response) {
                   if(response.status === 200 && response.data.status === 'success' && response.data.token){
                        ClearCredentials();
                       SetToken(response.data.token);
                   }
                   callback(response.data);
               },function(response){
                   ClearCredentials();
                   callback(response.data);

               });

        }

        function SetToken(token){
            $rootScope.globals = {
                currentUser: {
                    token: token
                }
            };

            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'Token ' + token;

            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Token';
        }
    }
})();