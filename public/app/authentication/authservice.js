mainApp.service('authService', authService);

  authService.$inject = ['$state', '$timeout', '$cookies', '$http'];

  function authService($state,  $timeout, $cookies, $http) {

    var accessToken;
    var idToken;
    var expiresAt;

    var user = "";
    var userObject;

    function getUserObject(cb){
      console.log('getting user db object for');
      console.log(user);
      $http({
        method: 'GET',
        url: 'users/userobject',
        headers: {'username' : user}
      }).then(function(userObj){
        console.log('results from retrieving getUserObj');
        console.log(userObj)
        userObject = userObj;
        userObject.categories = userObject.categories;
        if(cb){
          cb(userObj);
        }else{
          return userObj;
        }
      })
    }

    function validateToken(token,cb){
      console.log('this is the token being passed in to validateToken');
      console.log(token);
      $http({
        method: 'GET',
        url: 'users/validatetoken',
        headers: {'token' : token}
      }).then(function(userTokenObj){
        console.log(userTokenObj);
        user = userTokenObj.data[0].username;
        id = userTokenObj.data[0]._id;
        console.log('user validated');
        console.log(userTokenObj);
        console.log(user + ' is now logged in');
        cb(user);
      })
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
      localStorage.removeItem('username');
      // Remove tokens and expiry time
      accessToken = '';
      idToken = '';
      expiresAt = 0;
      $cookies.remove('auth');
      console.log('logged out. username is now : ' + localStorage.getItem('username'));
      $state.go('home');
    }

    function isAuthenticated() {

     if ($cookies.get("auth")) {
      return true;
    } else {
      // Handle the authentication
      // result in the hash
      return false;
    }
    }

    function loadUserFromCookie(auth){
      $http({
        method: 'PUT',
        url: 'users/validatetoken',
        headers: {
          'Content-Type' : "application/json"
        },
        data: {'hashedToken' : auth }
      }).then( function (response){
        if(response){
          console.log(response.data[0].username);
          user = response.data[0].username;
          return user;
        }else{
          console.log('no response from server');
          return false;
        }
      });
    }

    return {
      userObject : userObject,
      getUserObject : getUserObject,
      validateToken : validateToken,
      logout: logout,
      isAuthenticated: isAuthenticated,
      renewTokens: renewTokens,
      loadUserFromCookie: loadUserFromCookie,
      user: user
    }
  }
