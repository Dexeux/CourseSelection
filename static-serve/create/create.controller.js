(function () {
    'use strict';

    angular
        .module('app')
        .controller('CreateCourseController', CreateCourseController);

    CreateCourseController.$inject = ['CoursesService', 'AuthenticationService', 'FlashService', '$location'];
    function CreateCourseController(CoursesService, AuthenticationService, FlashService, $location) {
        var vm = this;

        vm.logout = logout;
        vm.goToCourseSelection = goToCourseSelection;
        vm.createCourse = createCourse;
        vm.createRandomCourses = createRandomCourses;
        vm.course = {};
        vm.course.courseSubject = 'Elective';

        function logout(){
            AuthenticationService.Logout(function(){
                $location.path('/');
            });
        }

        function goToCourseSelection(){
            $location.path('/home');
        }

        function createCourse(){
            if(!vm.course.courseCode || !vm.course.courseName || !vm.course.courseSubject){ return; }
            CoursesService.Create(vm.course).then(function(response){
                if(response.status === 'success'){
                    FlashService.Success('Success');
                }else {
                    FlashService.Error(response.message);
                }
            });
        }

        function createRandomCourses(){
            var coursesToAdd = [];
            for (var i = 0; i < 10; i ++){
                coursesToAdd.push({courseName: randomString(), courseSubject: randomSubject(), courseCode: randomString()})
            }
            CoursesService.Create(coursesToAdd).then(function(response){
                if(response.status === 'success'){
                    FlashService.Success('Success');
                }else {
                    FlashService.Error(response.message);
                }
            });
        }

        // generate a random 5 string text
        function randomString(){
            var output = "";
            var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for(var i = 0; i < 5; i++) {
               output += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
            }
            return output;
        }

        function randomSubject(){
            var possibleSubjects = ['Math', 'English', 'Science', 'History', 'Elective'];
            return possibleSubjects[Math.floor(Math.random() * possibleSubjects.length)];
        }

    }

})();