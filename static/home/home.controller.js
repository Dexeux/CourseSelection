(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['CoursesService', '$scope', 'AuthenticationService', '$location', 'FlashService', '$timeout'];
    function HomeController(CoursesService, $scope, AuthenticationService, $location, FlashService, $timeout) {
        var vm = this;
	    var hsort_flg = false;
	    var vg;
        $scope.filters = {math: true, science: true, english: true, history: true, elective: true};
        vm.courses = [];

        vm.logout = logout;
        vm.goToProfile = goToProfile;
        vm.isCourseInFilter = isCourseInFilter;
        vm.selectCourse = selectCourse;
        vm.register = register;
        vm.sort = sort;
        vm.shuffle = shuffle;


        getCourses();

        //Watch if filters change
        $scope.$watch("filters", function(newValue, oldValue) {
            $timeout(setUpCardDisplay, 0);
        }, true);

        //Gets the list of courses available to register
        function getCourses() {
            CoursesService.GetAll().then(function(response){
                if(response.status === "success"){
                    vm.courses = response.data;
                    setUpCardDisplay();
                }
            });
        }

        function logout(){
            AuthenticationService.Logout(function(){
                $location.path('/');
            });
        }

        function goToProfile(){
            $location.path('/profile');
        }

        function isCourseInFilter(course){
            return $scope.filters[course.courseSubject.toLowerCase()];
        }

        function selectCourse(course){
            course.selected = !course.selected;
        }

        function register(){
            var selected = vm.courses.filter(function(course){
                return course.selected;
            });
            CoursesService.Register(selected).then(function(response){
                if(response.status === 'success'){
                    FlashService.Success('Courses registered successfully.');
                } else {
                    FlashService.Error('Error');
                }
                getCourses();
            });
        }

        //Visual Functions
        function sort(){
            $(function() {
                hsort_flg = !hsort_flg;
                $("#grid-content").vgsort(function (a, b) {
                    var _a = $(a).find('h3').text();
                    var _b = $(b).find('h3').text();
                    var _c = hsort_flg ? 1 : -1;
                    return (_a > _b) ? _c * -1 : _c;
                }, "easeInOutExpo", 300, 0);
            });
        }

        function shuffle(){
            $(function() {
                $("#grid-content").vgsort(function(a, b){
                    return Math.random() > 0.5 ? 1 : -1 ;
                }, "easeInOutExpo", 300, 20);
                hsort_flg = true;
                return false;
            });
        }

        //Setup the card display
        function setUpCardDisplay(){
            $(function(){
                //setup
                vg = $("#grid-content").vgrid({
                    easing: "easeOutQuint",
                    time: 400,
                    delay: 20,
                    fadeIn: {
                        time: 500,
                        delay: 50,
                        wait: 500
                    }
                });
                $(window).on(function(e){
                    vg.vgrefresh();
                });
            });
        }
    }

})();