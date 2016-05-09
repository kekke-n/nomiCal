// nomiCal.js

var MyApp = angular.module('nomiCalApp',[]);

MyApp.controller('nomiCalAppCtrl', ['$scope' ,function($scope){
	var index = 0;

	// var nomiCal = $scope;
	$scope.nomiMember = [
      {id:index, name:'中間', price:'0'},
	];

	index++;

	// のみ仲間追加関数
	$scope.addMember = function(){
		$scope.nomiMember.push({id:index, name:$scope.memberName,price:''});
		$scope.memberName = '';
		index++;
	};

	// のみ仲間削除関数
	$scope.deleteMember = function(member){
		var delIndex = 0;
		var m;
		for(var i=0; $scope.nomiMember.length; i++){
			m = $scope.nomiMember[i];
			if(m.id == member.id){
				// 削除対象のメンバーのidと一致した場合
				delIndex = i;
				break;
			}
		}
		$scope.nomiMember.splice(delIndex, 1); // 一致したidをのメンバーを削除する
	};

	$scope.calcPrice = function(member){
		var totalPrice = $scope.totalPrice;
		var sum = $scope.nomiMember.length;

		member.price = totalPrice/sum;
		return member.price;
	};



}]);