// nomiCal.js

var MyApp = angular.module('nomiCalApp',[]);

MyApp.controller('nomiCalAppCtrl', ['$scope' ,function($scope){
	var index = 0;

	// var nomiCal = $scope;
	$scope.member = [
      {id:index, name:'中間'},
	];

	index++;

	$scope.addMember = function(){
		$scope.member.push({id:index, name:$scope.memberName});
		$scope.addMemberName = '';
		index++;
	};

	$scope.deleteMember = function(delMember){
		var delIndex = 0;
		var m;
		for(var i=0; $scope.member.length; i++){
			m = $scope.member[i];
			if(m.id == delMember.id){
				delIndex = i;
				break;
			}
		}
		$scope.member.splice(delIndex, 1);
	};

}]);