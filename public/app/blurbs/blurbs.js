mainApp.controller('blurbsCtrl', ['$scope', '$http', 'blurbFactory', function($scope, $http, blurbFactory){
	// $scope.getLatestCategories = function(){

	// };

	// $scope.getRandomCategories = function(){

	// };

	$scope.latestBlurbs;
	$scope.randomBlurbs = [];
	var randomDupeCheck = {};

	$scope.getLatestBlurbs = function(skipCount){
		blurbFactory.getLatestBlurbs(skipCount, function(results){
			console.log('getting latest blurbs');
			console.log(results);
			$scope.latestBlurbs = results.data;
		})
	}

	$scope.getRandomBlurbs = function(count){

		blurbFactory.getRandomBlurbs(count, function(results){
			if(results.data.length === 0){
					$scope.getRandomBlurbs(count);
			}else{
				var id = results.data[0]._id;
				console.log(randomDupeCheck);
					if(randomDupeCheck[id] === 1){
						console.log(randomDupeCheck[id] + ' already exists');
						$scope.getRandomBlurbs(count);
					}else{
						console.log('on number: ' +  count + ' of cycle');
						randomDupeCheck[id] = 1;
						$scope.randomBlurbs.push(results.data[0]);
						if(count < 0){
							return
						}else{
							$scope.getRandomBlurbs(count-1);
						}
					}
			
					console.log('getting random Blurbs');
					console.log(results);
			}
			
		})
	}

	$scope.scroll = false;
	$scope.leftScrollLatestBlurbs = function(){
		if($scope.scroll){
			document.getElementById('latestBlurbsContainer').scrollLeft = document.getElementById('latestBlurbsContainer').scrollLeft - 400;
			setTimeout(function(){$scope.leftScroll()},500);
		}
	}

		$scope.rightScrolllatestBlurbs = function(){
		if($scope.scroll){
			document.getElementById('latestBlurbsContainer').scrollLeft = document.getElementById('latestBlurbsContainer').scrollLeft + 250;
			// var containerWidth = document.getElementById('latestBlurbsCards').style["min-width"].toString();
			// containerWidth = containerWidth.split('px');
			// console.log(containerWidth);
			// containerWidth = parseInt(containerWidth[0]) + 1000;
			// containerWidth = containerWidth.toString() + "px";
			// console.log(containerWidth);

			// document.getElementById('latestBlurbsCards').style["min-width"] = containerWidth;
			console.log(document.getElementById('latestBlurbsCards').style["min-width"]);
			setTimeout(function(){$scope.rightScroll()},500);
		}
	}

	$('#latestBlurbsLeft').mousedown(function(){
		$scope.scroll = true;
		$scope.leftScrollLatestBlurbs();
		}).mouseup(function(){
			console.log('mouseup');

	}).mouseup(function(){
		$scope.scroll = false;
	})

	$('#latestBlurbsRight').mousedown(function(){
		$scope.scroll=true;
		$scope.rightScrolllatestBlurbs();
		}).mouseup(function(){
			console.log('mouseup');
		
	}).mouseup(function(){
		$scope.scroll = false;
	})








		$scope.scroll = false;
	$scope.leftScrollrandomBlurbs = function(){
		if($scope.scroll){
			document.getElementById('randomBlurbsContainer').scrollLeft = document.getElementById('randomBlurbsContainer').scrollLeft - 400;
			setTimeout(function(){$scope.leftScrollrandomBlurbs	()},500);
		}
	}

		$scope.rightScrollrandomBlurbs = function(){
		if($scope.scroll){
			document.getElementById('randomBlurbsContainer').scrollLeft = document.getElementById('randomBlurbsContainer').scrollLeft + 250;
			setTimeout(function(){$scope.rightScrollrandomBlurbs()},500);
		}
	}

	$('#randomBlurbsLeft').mousedown(function(){
		$scope.scroll = true;
		$scope.leftScrollrandomBlurbs();
		}).mouseup(function(){
			console.log('mouseup');

	}).mouseup(function(){
		$scope.scroll = false;
	})

	$('#randomBlurbsRight').mousedown(function(){
		$scope.scroll=true;
		$scope.rightScrollrandomBlurbs();
		}).mouseup(function(){
			console.log('mouseup');
		
	}).mouseup(function(){
		$scope.scroll = false;
	})







	// $('#latestBlurbsLeft').on('mousedown',function(){
	// 	console.log('left clicked');
	// 	var scrollLeft = document.getElementById('latestBlurbsContainer').scrollLeft;
	// 	if(scrollLeft > 0){
	// 		document.getElementById('latestBlurbsContainer').scrollLeft = document.getElementById('latestBlurbsContainer').scrollLeft - 50;
	// 	}
	// })


	// $('#latestBlurbsRight').on('mousedown',function(){
	// 	console.log('right clicked');
	// 	var scrollRight = document.getElementById('latestBlurbsContainer').scrollLeft;
	// 	document.getElementById('latestBlurbsContainer').scrollLeft = document.getElementById('latestBlurbsContainer').scrollLeft + 50;
	// })

	$scope.getLatestBlurbs(15);
	$scope.getRandomBlurbs(15);


}])