mainApp.controller('registerCtrl', ['$scope', 'angularAuth0', function($scope, angularAuth0){

	$scope.errorMessage = "none";


	$scope.credentials = {};
	$scope.credentials.firstname = "";
	$scope.credentials.lastname = "";
	$scope.credentials.username = "";
	$scope.credentials.password = "";
	$scope.credentials.email = "";


	$scope.signUp = function(){
		console.log('first name' + $scope.credentials.firstname);
		console.log('last name' + $scope.credentials.lastname);
		console.log('username' + $scope.credentials.username);

		angularAuth0.signup({
			client_id: 'x4QhXO346dfoY4wzVnWttmDAvFbQogAS', 
			connection: 'Username-Password-Authentication',
			username: $scope.credentials.username,
			email: $scope.credentials.email,
			password: $scope.credentials.password,
			user_metadata: {firstname: $scope.credentials.firstname, lastname: $scope.credentials.lastname}

		}, function(err){
			if(err) return console.log(err)
			return alert('success signup without login')
		});
	}


}]);

registerCtrl.$inject = ['$scope', '$angularAuth0', 'angularAuth0']

function registerCtrl($scope,angularAuth0, angularAuth0) {











	var accessToken;
    var idToken;
    var expiresAt;

    function getIdToken() {
      return idToken;
    }

    function getAccessToken() {
      return accessToken;
    }

    function login() {
      angularAuth0.authorize();
    }

    function handleAuthentication() {
      angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          localLogin(authResult);
          $state.go('home');
        } else if (err) {
          $timeout(function() {
            $state.go('home');
          });
          console.log(err);
          alert('Error: ' + err.error + '. Check the console for further details.');
        }
      });
    }

    function localLogin(authResult) {
      // Set isLoggedIn flag in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      // Set the time that the access token will expire at
      expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
      accessToken = authResult.accessToken;
      idToken = authResult.idToken;
    }

    function renewTokens() {
      angularAuth0.checkSession({},
        function(err, result) {
          if (err) {
            console.log(err);
          } else {
            localLogin(result);
          }
        }
      );
    }

    function logout() {
      // Remove isLoggedIn flag from localStorage
      localStorage.removeItem('isLoggedIn');
      // Remove tokens and expiry time
      accessToken = '';
      idToken = '';
      expiresAt = 0;

      angularAuth0.logout({
        returnTo: window.location.origin
      });

      $state.go('home');
    }

    function isAuthenticated() {
      // Check whether the current time is past the 
      // access token's expiry time
      return localStorage.getItem('isLoggedIn') === 'true' && new Date().getTime() < expiresAt;
    }

    return {
      login: login,
      getIdToken: getIdToken,
      getAccessToken: getAccessToken,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated,
      renewTokens: renewTokens
    }
  }
