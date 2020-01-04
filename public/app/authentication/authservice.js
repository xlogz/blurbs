mainApp.service('authService', authService);

  authService.$inject = ['$state', 'angularAuth0', '$timeout', '$http'];

  function authService($state, angularAuth0, $timeout, $http) {

    var accessToken;
    var idToken;
    var expiresAt;
    var username;
    var email;
    var userObject = {}

    function getIdToken() {

      return idToken;
    }

    function getAccessToken() {

      return accessToken;
    }

    function login() {
      var token = getAccessToken( function(error){
        console.log(error);
      });
      angularAuth0.authorize();
      
    }

    function handleAuthentication() {

      angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          console.log('this is the auth result from auth0');
          console.log(authResult);
          localLogin(authResult);

          $http({
            method: 'put',
            url: '/users/authToken',
            data: 'authResult'
          }).then(function(response){
            console.log(response);
          });

          
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

    function requestTest(){
      console.log('testing request');
      $http({
        method: 'put',
        url: '/users/authToken',
        // headers: {Authorization: 'Bearer ' +  },
        data: authResult
      }).then(function(response){
         console.log(response);
      

      })
    }

    // function getUserInfo (userid){
    //         console.log('getUserInfo');
    //         var userid2 = getUserId(getAccessToken().username)
    //           console.log(userid2);

    //           $http({
    //             method: 'put',
    //             url: '/get/userInfo',
    //             data: {userid: id}
    //             // data: authResult
    //           }).then(function(response, err){
    //             console.log('this is the response from get user info')
    //             console.log(response);
    //             console.log(err);

    //           })
            
    //         console.log(userid2);

    // }

      function getUserId (token, cb){
            console.log('getUserId');
            var token2 = getAccessToken();
            var response = response;
            var results;
            console.log(token2);
           
            //use token to retrieve appropriate id
           $http({
            method: 'get',
            url: 'https://dev-kihm7h2g.auth0.com/userinfo',
            headers: {Authorization: 'Bearer '+ token2},
            data: token 
            // data: authResult
          }).then(function(response, err){
            //use id to retrieve user information
            console.log(response.data.sub);
            $http({
                method: 'put',
                url: '/get/userInfo',
                headers: {data: response.data.sub } 
                // data: authResult
              }).then(function(response, err){
                console.log(response);
                username = response.data[0].username;
                email = response.data[0].email;

                userObject.username = response.data[0].username;
                userObject.email = response.data[0].email;
                userObject = response.data[0];
                

              });
              


          })
          console.log('here are the results of getUserId');
          console.log(userObject);
          return userObject;
    }


      function getAll(){
        var authToken = getAccessToken();
        var userId = getUserId(authToken);
        var userInfo = getUserInfo(userId);
        console.log(userInfo);
      }


      function getTest (){
        console.log('getTest')
        $http({
          method: 'put',
          url: '/get/test',
          data: {token: 'testing123'}
        }).then(function(response, err){
          console.log(response);
          console.log(err);

        })
      }

      function getUserDBObject(name, cb){
        console.log('username thats being passed to getuserobject: ');
        console.log(name);
        var results;

        $http({
          type: 'GET',
          url: '/users/userObject',
          headers: {name: name}
        }).then(function(id){
          console.log('This is the reference to userObject in databasee');
          console.log(id);
          results = id;
          cb(results);
        });
        

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
      renewTokens: renewTokens,
      requestTest: requestTest,
      getAll: getAll,
      getUserId: getUserId,
      getTest: getTest,
      getUserDBObject: getUserDBObject,
      username: username,
      email: email

    }
  }
