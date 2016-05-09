// nomiCal.js

var MyApp = angular.module('nomiCalApp',[]);

MyApp.controller('nomiCalAppCtrl', ['$scope' ,function($scope){
	var index = 0;

	// var nomiCal = $scope;
	$scope.nomiMember = [
      {id:index, name:'中間', price:'0'},
	];

	index++;

	$scope.addMember = function(){
		$scope.nomiMember.push({id:index, name:$scope.memberName,price:''});
		$scope.memberName = '';
		index++;	
	};

	$scope.deleteMember = function(member){
		var delIndex = 0;
		var m;
		for(var i=0; $scope.nomiMember.length; i++){
			m = $scope.nomiMember[i];
			if(m.id == member.id){
				delIndex = i;
				break;
			}
		}
		$scope.nomiMember.splice(delIndex, 1);
	};

	$scope.calcPrice = function(member){
		var totalPrice = $scope.totalPrice;
		var sum = $scope.nomiMember.length;

		member.price = totalPrice/sum;
		return member.price;
	};



}]);