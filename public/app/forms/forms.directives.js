console.log('directives should be loaded');

// mainApp.directive('checkSpaces', function(){
// 	return {
// 		template: 'Hello'
// }
// });

	
// })

mainApp.directive('checkSpaces', function(){
	return {
		scope: {
			checkSpaces: '='
		},
		link: function(scope, element, attrs, control){
		element.bind("keydown", function(event){
			console.log(event.code.toLowerCase());
			if(event.code.toLowerCase() === "space"){
				$scope.errorMessage = "You cannot have spaces in your Category name";
				$scope.showErrorMessage = true;
				console.log('space was entered');
			}else{
				console.log('some key was pressed');
			}
		})
	}
	}
})