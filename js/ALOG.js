

var app = angular.module("alogApp",[]);

//	FILTERS ACTIVITY
//	INEFFECTIVE METHOD
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


app.controller("viewGridController", function($scope, viewGridFactory, $filter) {

	$scope.hours= [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];

	//	MIN MAX DATES FOR DATE PICKER
	function setDateRange(){
		viewGridFactory.getDateRange().success(function(data){
			$scope.datemin = data.min;
			$scope.datemax = data.max;
		});
	}

	setDateRange();

	//	LOADS ACTIVITIES OF 5 DAYS FROM START DATE ON SCREEN
	//	MUST FILL DATES TOO SO THAT BOTH ARE USED BY PRESENTATION
	function init(){
		
		var d = new Date($scope.dateStart);
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		var day = d.getDate();

		viewGridFactory.getActivities(year,month,day).success(function(data){
			$scope.data = data;
		});

		$scope.dates = getDates($scope.dateStart);

		$scope.isPreviousAllowed = getIsPreviousAllowed($scope.datemin,$scope.dateStart);
		$scope.isNextAllowed = getIsNextAllowed($scope.datemax,$scope.dateStart);

	}

	function getIsPreviousAllowed(mindate,startdate){
		var dmin = new Date(mindate);
		var sd = new Date(startdate);
		if(dmin<sd)
			return true;
		return false;
	}

	function getIsNextAllowed(maxdate,startdate){
		var dmax = new Date(maxdate);
		var newdate = new Date(startdate);
		newdate.setDate(newdate.getDate()+5-1);
		if(dmax>newdate)
			return true;
		return false;
	}

	function getDates(startdate){
		dates = [];
		var i=0;
		while(i<5){
			var d = new Date(startdate);
			d.setDate(d.getDate()+i);
			dates.push(d);
			i++;
		}
		return dates;
	}

	//	SELECT DATE TO LOAD ACTIVITIES
	$scope.change = function(){

		init();
	};


});


app.factory('viewGridFactory', function($http){
	var factory = {};
	
	// GET 5 DAYS OF ACTIVITIES
	factory.getActivities = function(year,month,day) {
		return $http.get(
				'http://127.0.0.1:12345/activity/activities/'+
				year+'/'+month+'/'+day+
				'/5/rows.json'
			);
	};

	//	GET DATE RANGE
	factory.getDateRange = function(){
		return $http.get('http://127.0.0.1:12345/activity/activities/daterange.json');
	};
	return factory;
});