

var app = angular.module("alogApp",[]);
app.controller("viewGridController", function($scope, viewGridFactory) {


	$scope.dateToday = new Date();
	$scope.dateStart = new Date();
	$scope.dates = [];
	$scope.hours= [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
	
	Date.prototype.getDateString = function() {

			var year = this.getFullYear();
			var month = this.getMonth() + 1;
			var day = this.getDate();

			var month_string = "00"+month;
			month_string = month_string.substr(month_string.length-2);

			day_string="00"+day;
			day_string = day_string.substr(day_string.length-2);

			var date_formatted = year+"-"+month_string+"-"+day_string;

			return date_formatted;
	};


	function init(){
		
		var d = new Date($scope.dateStart);
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		var day = d.getDate();

		viewGridFactory.getActivities(year,month,day).success(function(data){
			$scope.data = data;
			refreshActivitiesGrid(data);
		});
	}

	//
	// SELECT DATE TO LOAD ACTIVITIES
	//
	$scope.change = function(){

		//
		//	CHANGE DATES & CALL INIT WHICH CALLS GETACTIVITIES AND UPDATES GRID
		//

		var i=0;
		while(i<5){

			var d = new Date($scope.dateStart);
			d.setDate(d.getDate()+i);
			$scope.dates[i] = d;

			i++;
		}

		init();
	};

	function refreshActivitiesGrid(activities_data){
		//
		//	object array to convenient matrix
		//	object arry must be in same order as dates filter
		//	output ---- means else condition has been entered
		//
		var activities_grid_before = [];
		var i=0;
		console.log("activities_data:" + activities_data)
		if(activities_data.length>0){



			var k=0;
			while(k<$scope.dates.length){
				var date = $scope.dates[k];

				date = date.getDateString();
				
				var activities_grid_before_inner = [];

				var j=0;
				while(j<$scope.hours.length){
					var hour = $scope.hours[j];

					var activities_in_a_cell = [];
					

					//
					// Date, hour is sorted
					//
					var inserted = false;
					while(true){
						var current_date=activities_data[i].date;
						var current_hour=activities_data[i].hour;

						console.log(activities_data[i]);

						if(current_date == date && current_hour == hour){
							console.log("current equals");
							// INSERT ACTIVITY RECORD FOR CELL
							activities_in_a_cell.push(activities_data[i]);

							inserted = true;
							i++;
							if(i<activities_data.length){
								//ACCESS NEXT ENTRY TO CHECK IF ITS MULTIPLE ACTIVITY
								var next_date = activities_data[i].date;
								var next_hour = activities_data[i].hour;
								if(next_date == date && next_hour == hour){
									console.log("next equals");
									continue;
								}
								else break; // OTHER ENTRY
							}
							else break; // NO MORE ENTRIES
						}
						else break;// LEAVE ENTRY ALONE MOVE DATES AND HOURS
					}
					if(!inserted){
						//	DUMMY ENTRY
						activities_in_a_cell.push({"date": date, "details": "", "hour": hour, "activity": "----"});
					}

					/*
					if(activities_data[i].date == date &&
						activities_data[i].hour == hour){
						activities_in_a_cell.push(activities_data[i]);
						i++;
					}else{
						activities_in_a_cell.push({"date": date, "details": "", "hour": hour, "activity": "----"});
					}*/



					activities_grid_before_inner.push(activities_in_a_cell);
					j++;
					
				}// LOOP

				activities_grid_before.push(activities_grid_before_inner);
				k++;
			}// LOOP

			console.log(i);
			console.log(activities_data.length);
			console.log("diff:"+(activities_data.length-i));

			//
			//	transpose to fit grid
			//
			var rows = activities_grid_before.length;
			var cols = activities_grid_before[0].length;
			var activities_grid_transpose = []
			for(var i=0;i<cols;i++){
				activities_grid_transpose.push([]);
			}
			for(var i=0;i<rows;i++){
				for(var j=0;j<cols;j++){
					activities_grid_transpose[j].push(activities_grid_before[i][j]);
				}
			}

		}//	IF DATA FROM JSON LENGTH > 1


		$scope.activities_grid = activities_grid_transpose;
	} 

});

//
// GET 5 DAYS OF ACTIVITIES
//
app.factory('viewGridFactory', function($http){
	var factory = {};
	factory.getActivities = function(year,month,day) {
		return $http.get('http://127.0.0.1:12345/activity/activities/'+year+'/'+month+'/'+day+'/5/rows.json');
	};
	return factory;
});