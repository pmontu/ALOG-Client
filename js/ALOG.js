

var app = angular.module("alogApp",[]);

app.filter('datehour', function($filter){
	return function(items, date, hour){
		output = [];
		date = $filter('date')(date,"yyyy-MM-dd");
		angular.forEach(items,function(activity){
			if(activity.date == date && activity.hour == hour)
				output.push(activity);
		});
		return output;
	};
});

app.controller("viewGridController", function($scope, viewGridFactory) {


	$scope.dateToday = new Date();
	$scope.dateStart = new Date();
	$scope.dates = [];
	$scope.hours= [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];

	function init(){
		
		var d = new Date($scope.dateStart);
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		var day = d.getDate();

		viewGridFactory.getActivities(year,month,day).success(function(data){
			$scope.data = data;
			console.log(data);
		});

		var i=0;
		while(i<5){
			var d = new Date($scope.dateStart);
			d.setDate(d.getDate()+i);
			$scope.dates[i] = d;
			i++;
		}

	}

	//
	// SELECT DATE TO LOAD ACTIVITIES
	//
	$scope.change = function(){

		init();
	};


});

//
// GET 5 DAYS OF ACTIVITIES
//
app.factory('viewGridFactory', function($http){
	var factory = {};
	factory.getActivities = function(year,month,day) {
		return $http.get(
				'http://127.0.0.1:12345/activity/activities/'
				+year+'/'+month+'/'+day+'/5/rows.json'
			);
	};
	return factory;
});