(function () {
    'use strict';

    angular
        .module('app')
        .factory('CoursesService', CoursesService);

    CoursesService.$inject = ['$http'];
    function CoursesService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.Create = Create;

        return service;

        function Create(user) {
            return $http.post('/api/v1/auth/register', user).then(handleSuccess, handleError('Error creating user'));
        }

        function GetAll(user) {
            return $http.post('/api/v1/auth/register', user).then(handleSuccess, handleError('Error creating user'));
        }
        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
