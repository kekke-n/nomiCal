// nomiCal.js

var MyApp = angular.module('nomiCalApp',[]);

MyApp.controller('nomiCalAppCtrl', ['$scope' ,function($scope){
	var index = 0;

	// var nomiCal = $scope;
	$scope.nomiMember = [
		{id:index, name:'中間', position:'一般', weight:1, price:0},
	];

	index++;

	// 役職選択肢
	$scope.positions = ['一般','部長','課長','チーフ'];
	// デフォルト値の設定
	$scope.position = $scope.positions[0];

	// のみ仲間追加関数
	$scope.addMember = function(){
		$scope.nomiMember.push({id:index, name:$scope.memberName, position:'一般', weight:1, price:''});
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

	// 500円毎に切り上げする関数
	function ceilFiveHundred(num){

		if((num % 1000) == 0){
			// 1000の倍数である場合
			return num;
		}

		var hundredDigit = Math.floor(num / 1000);
		
		if((num % 1000) > 500){
			// 下３桁が500より上
			return (hundredDigit + 1) * 1000;
		}
		else if((num % 1000) <= 500){
			// 下３桁が500以下
			return (hundredDigit * 1000) + 500;
		}
		else{
			return num;
		}
	};

	$scope.calcPrice = function(member){
		var totalPrice = $scope.totalPrice;
		var sum = $scope.nomiMember.length;

		member.price = ceilFiveHundred(totalPrice/sum);
		return member.price;
	};

}]);