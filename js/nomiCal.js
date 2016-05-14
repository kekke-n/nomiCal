// nomiCal.js

var MyApp = angular.module('nomiCalApp',[]);

MyApp.controller('nomiCalAppCtrl', ['$scope' ,function($scope){
	var index = 0;

	$scope.shortage = 0;
	$scope.surplus = 0;
	$scope.message = "";

	var shortageMessage =
	[
		"先輩、お願いしますー！！",
		"ぐるなびの割引をさがせぇー！！",
		"自分で建て替えるなー！！"
	];	

	var surplusMessage =
	[
		"２次会でつかうかー！！",
		"幹事代としてもらってしまえ！！",
		"帰りにアイスたべよう！！"
	];

	// var nomiCal = $scope;
	$scope.nomiMember = [
		{id:index, name:'中間', position:'一般', weight:1, price:0},
	];

	index++;

	// 役職選択肢
	$scope.positions = ['一般', '部長', '課長', 'チーフ']; 
	// $scope.positions = [
	// 	{type:'一般', weight:'1'},
	// 	{type:'部長', weight:'1.5'},
	// 	{type:'課長', weight:'1.3'},
	// 	{type:'チーフ', weight:'1.2'}
	// デフォルト値の設定
	// $scope.nomiMember.position = $scope.positions[0].type;

	// 飲み代重みテーブル
	var weightTable = [
		{type:'一般', weight:1},
		{type:'部長', weight:1.6},
		{type:'課長', weight:1.3},
		{type:'チーフ', weight:1.1}
	];

	// のみ仲間追加関数
	$scope.addMember = function(){
		$scope.nomiMember.push({id:index, name:$scope.memberName, position:'一般', weight:1, price:0});
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

	// 配列の合計値取得関数
	function getSum(array){
		var sum = 0;
		for(var i=0; i < array.length; i++){
			sum = sum + array[i];
		}
		return sum;
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
	
	// 100円毎に切り下げる関数
	function floatFifty(num){
		if((num % 100) == 0){
			// 100の倍数である場合
			return num;
		}

		var hundredDigit = Math.floor(num / 100);
		
		if((num % 100) >= 50){
			// 下2桁が50以上
			return (hundredDigit * 100) + 50;
		}
		else if((num % 100) < 50){
			// 下2桁が50以下
			return hundredDigit * 100;
		}
		else{
			return num;
		}
	}

	// 500円毎に切り下げる関数
	function floatFiveHundred(num){

		if((num % 1000) == 0){
			// 1000の倍数である場合
			return num;
		}

		var hundredDigit = Math.floor(num / 1000);
		
		if((num % 1000) >= 500){
			// 下３桁が500より上
			return (hundredDigit * 1000) + 500;
		}
		else if((num % 1000) < 500){
			// 下３桁が500以下
			return hundredDigit * 1000;
		}
		else{
			return num;
		}
	};

	// 飲み代重み計算関数
	function calcWeight(){
		var member = $scope.nomiMember;

		for(var m in member){
			for(var w in weightTable){
				if(member[m].position == weightTable[w].type){
					member[m].weight =weightTable[w].weight;
					break;
				}
			}
		}
	};

	// 重み掛け関数
	function multiplyPriceByWeight(priceList){
		var member = $scope.nomiMember;

		for(var i = 0; i < priceList.length; i++){
			priceList[i] = priceList[i]* member[i].weight;
		}

		return priceList;
	}


	// 余剰金分配計算関数
	function paybackSurplus(priceList, surplus){
		for(var i=0; i < priceList.length; i++){
			var float = priceList[i] - surplus;
			if(float < 500){
				// 500円以下の場合は100円毎に切り捨てる
				priceList[i] = floatFifty(float);
			}
			else{
				priceList[i] = floatFiveHundred(float);
			}
			if(priceList[i] < 0)
			{
				// 割り勘の額にマイナス値はあり得ないため、0にする
				priceList[i] = 0;
			}
		}
		return priceList;
	}

	// 重みが最も大きい人に不足金を負担させる
	function addShortageToTopWeighter(priceList, shortage){
		var member = $scope.nomiMember;
		var maxWeight = member[0].weight;
		var maxIndex = 0;
		var sameWeightFlag = true;
		var maxMember = [0];

		for(var i=1; i < priceList.length; i++){ // i=0はmaxWeightの初期値に格納されているため、ループは不要
			if(member[i].weight > maxWeight){
				maxWeight = member[i].weight;
				maxIndex = i;
				maxMember = [i];
				sameWeightFlag = false;
			}
			else if(member[i].weight < maxWeight)
			{
				sameWeightFlag = false;
			}
			else if(member[i].weight == maxWeight){
				maxMember.push(i);
			}
		}

		if(sameWeightFlag){
			// のみ仲間全員の重みが同じであれば、不足分はじゃんけんできめるようにメッセージを表示する。
			// $scope.shortageMessage = "残り"+shortage+"円はじゃんけんで決めて！！";
			$scope.shortage = shortage;
		}
		else{

			if(maxMember.length > 1){
				// 重みが最も多い人が複数いる場合
				var sum = maxMember.length;	// 重みが最も多い人の数
				var add = ceilFiveHundred(shortage/sum);	//重みが多い人が一人あたりに負担する額

				for(var i = 0; i < maxMember.length; i++){
					priceList[maxMember[i]] += add;
				}
			}
			else{
				// 重みが最も大きい人に不足金を追加する
				priceList[maxIndex] = priceList[maxIndex]  + shortage;
			}
				
			$scope.shortage = 0;
		}


		return priceList;
	}

	function setAllMemeberPrice(priceList){
		var member = $scope.nomiMember;
		for(var i=0; i < priceList.length; i++){
			member[i].price = priceList[i];
		}
	}

	// 不足、余剰金が発生したときのメッセージ表示関数
	function showMessage(){
		
		// 不足分がある場合はじゃんけんできめるメッセージを表示
		if($scope.shortage){
			if($scope.accountingAmount < 1000){
				$scope.message = $scope.accountingAmount+"円くらい自分で計算して";
				return;
			}
			var rand = shortageMessage[ Math.floor( Math.random() * shortageMessage.length )];
			$scope.message = ""+$scope.shortage+"円足りない！！"+rand;
		}
		// 不足分がある場合はじゃんけんできめるメッセージを表示
		else if($scope.surplus){
			var rand = surplusMessage[ Math.floor( Math.random() * surplusMessage.length )];
			$scope.message = ""+$scope.surplus+"円余った！！"+rand;
		}

	}
	
	// 不足/余剰金の計算
	function calcShortageAndSurplus(){
		var member = $scope.nomiMember;
		var accounting = $scope.accountingAmount;	// お会計額
		var total = 0;								// 各のみ仲間が支払う合計額


		for(var i=0; i<member.length; i++){
			total += member[i].price;
		}

		if(total < accounting){
			$scope.shortage = accounting - total;
			$scope.surplus = 0;
		}
		else if(total > accounting){
			$scope.shortage = 0;
			$scope.surplus = total - accounting;
		}
		else if(total == accounting){
			$scope.shortage = 0;
			$scope.surplus = 0;
		}

	}

	// 個人の飲み代計算関数
	$scope.showPrice = function(member){
		var accounting = $scope.accountingAmount;
		var sum = $scope.nomiMember.length;
		var split = 0;
		var priceList = [];
		var surplus = 0;		// 余剰金
		var shortage = 0;		// 不足金

		//初期化
		$scope.surplus = 0;
		$scope.shortage = 0;
		$scope.message = "";

		calcWeight();

		split  = ceilFiveHundred(accounting/sum);

		for(var i = 0; i < sum; i++){
			priceList[i] = split;
		}

		priceList = multiplyPriceByWeight(priceList);
		if(getSum(priceList) > accounting){
			// 支払額より多い場合
			surplus = (getSum(priceList) - accounting) / sum;
			priceList = paybackSurplus(priceList, surplus);
		}
		if(getSum(priceList) < accounting){
			// 支払額より少ない場合
			shortage = accounting - getSum(priceList);
			priceList = addShortageToTopWeighter(priceList, shortage);
		}

		// 各のみ仲間の支払額設定
		setAllMemeberPrice(priceList);
		// 不足/余剰金計算
		calcShortageAndSurplus();
		// 不足/余剰金表示
		showMessage();

		return member.price;
	};


	// 初期処理
	calcWeight();

}]);