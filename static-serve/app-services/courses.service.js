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
        service.Register = Register;

        return service;

        function Create(user) {
            return $http.post('/api/v1/auth/register', user).then(handleSuccess, handleError('Error creating user'));
        }

        function GetAll(params) {
            if (!params){ params = ''}
            return $http.get('/api/v1/courses/courses?query=' + params).then(handleSuccess, handleError('Error getting courses'));
        }

        function Register(courses) {
            return $http.post('/api/v1/courses/courses', courses).then(handleSuccess, handleError('Error creating user'));
        }

        function handleSuccess(res) {
            return res.data;
        }
        // private functions

        function handleError(error) {
            return function () {
                return { status: 'error', message: error };
            };
        }
    }

})();
