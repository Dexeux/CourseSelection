(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['CoursesService', '$scope', 'AuthenticationService', '$location', 'FlashService', '$timeout'];
    function ProfileController(CoursesService, $scope, AuthenticationService, $location, FlashService, $timeout) {
        var vm = this;
	    var hsort_flg = false;
	    var vg;

	    $scope.filters = {math: true, science: true, english: true, history: true, elective: true};
        vm.hasRequired = false;
        vm.courseSubjectsCovered = {Math: false, Science: false, English: false, History: false, Elective: false}; //Tracks which courses we have
        vm.message = 'Subjects missing: ';
        vm.courses = [];

        vm.logout = logout;
        vm.goToCourseSelection = goToCourseSelection;
        vm.isCourseInFilter = isCourseInFilter;
        vm.selectCourse = selectCourse;
        vm.unRegister = unRegister;
        vm.sort = sort;
        vm.shuffle = shuffle;

        getCourses();

        //Watch if filters change
        $scope.$watch("filters", function(newValue, oldValue) {
            $timeout(setUpCardDisplay, 0);
        }, true);


        function logout(){
            AuthenticationService.Logout(function(){
                $location.path('/');
            });
        }

        //Course Functions

        function getCourses() {
            CoursesService.GetRegistered().then(function(response){
                if(response.status === "success"){
                    vm.courses = response.data;
                    coverSubjects(vm.courses);
                    vm.hasRequired = areSubjectsCovered();
                    vm.message = getUnCoveredSubjects();
                    setUpCardDisplay();
                }
            });
        }

        function goToCourseSelection(){
            $location.path('/home');
        }

        function isCourseInFilter(course){
            return $scope.filters[course.courseSubject.toLowerCase()];
        }

        function selectCourse(course){
            course.selected = !course.selected;
        }

        function unRegister(){
            var selected = vm.courses.filter(function(course){
                return course.selected;
            });
            CoursesService.unRegister(selected).then(function(response){
                if(response.status === 'success'){
                    FlashService.Success('Courses dropped successfully.');
                } else {
                    FlashService.Error('Error');
                }
                getCourses();
            });
        }

        //Returns true if the user has covered all his courses
        function areSubjectsCovered(){
            for (var courseSubject in vm.courseSubjectsCovered){
                if (!vm.courseSubjectsCovered[courseSubject]){
                    return false;
                }
            }
            return true;
        }

        function resetCoverSubjects(){
            vm.courseSubjectsCovered = {Math: false, Science: false, English: false, History: false, Elective: false}; //Tracks which courses we have
        }

        // Creates an error string for uncovered subjects
        function getUnCoveredSubjects(){
            var output = 'Subjects missing: '
            for (var courseSubject in vm.courseSubjectsCovered){
                if (!vm.courseSubjectsCovered[courseSubject]){
                    output = output + courseSubject + ', '
                }
            }
            if(output === 'Subjects missing: '){
                output = 'All subjects covered!';
            }else{
                output = output.slice(0, -2);
                output += '.';
            }

            return output;

        }

        //Sets subjects covered to true
        function coverSubjects(courses){
            //Resets covered subjects
            resetCoverSubjects();
            //Cover subjects
            courses.forEach(function(course){
                vm.courseSubjectsCovered[course.courseSubject] = true;
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