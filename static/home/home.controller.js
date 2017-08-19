(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['CoursesService', '$scope', 'AuthenticationService', '$location', '$window', '$timeout'];
    function HomeController(CoursesService, $scope, AuthenticationService, $location, $window, $timeout) {
        var vm = this;
	    var hsort_flg = false;
	    var vg;
        $scope.filters = {math: true, science: true, english: true, history: true, elective: true};
        vm.courses = [{courseCode:"123", courseName:"AAA", courseSubject: "English"},
            {courseCode:"321", courseName:"CCC", courseSubject: "Math"},
            {courseCode:"321", courseName:"BBB", courseSubject: "Math"}];

        vm.logout = logout;
        vm.sort = sort;
        vm.shuffle = shuffle;
        vm.isCourseInFilter = isCourseInFilter;

        initController();

        $scope.$watch("filters", function(newValue, oldValue) {
            $timeout(setUpCardDisplay, 0);
        }, true);

        function initController() {
            CoursesService.GetAll().then(function(response){
                console.log(response);
                if(response.status === "success"){
                    console.log(response.data);
                    // vm.courses = response.data;
                }
            });
            setUpCardDisplay();
        }

        function logout(){
            AuthenticationService.Logout(function(){
                $location.path('/');
            });
        }

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

        function isCourseInFilter(course){
            return $scope.filters[course.courseSubject.toLowerCase()];
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


                    //add item
                //	$("#additem").click(function(e){
                //		var _item = $('<div><h3>New Item</h3><p>Foo</p><p><a href="#">DELETE</a></p></div>')
                //			.fadeTo(0, 0)
                //			.addClass(Math.random() > 0.3 ? 'wn' : 'wl')
                //			.addClass(Math.random() > 0.3 ? 'hn' : 'hl');
                //		vg.prepend(_item);
                //		vg.vgrefresh(null, null, null, function(){
                //			_item.fadeTo(300, 1);
                //		});
                //		hsort_flg = true;
                //	});

                    //delete
                //	vg.on('click', 'a', function(e){
                //		$(this).parent().parent().fadeOut(200, function(){
                //			$(this).remove();
                //			vg.vgrefresh();
                //		});
                //		return false;
                //	});
            });
        }
    }

})();