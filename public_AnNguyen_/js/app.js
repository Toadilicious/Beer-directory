console.clear();
var app = angular.module('MyApp', ['ngCookies']);

// User Registration controller
app.controller('UserController', ['$http', '$cookies', '$window',function($http, $cookies, $window){

  var controller = this;
  this.userName ="";
  this.password ="";
  this.notLogin = true;
  this.showRegisterForm = false;
  this.showLoginForm = false;
  this.isAdmin =false;
  this.addUser = function(){
    console.log('add user');
        $http({
            method:'POST',
            url:'/users',
            data: {
                username: this.registerUserName,
                password: this.registerPassword,
                isAdmin:  this.registIsAdmin
            }
        }).then(function(response){ //success
        }, function(error){ //fail
            alert('The user name is already taken....')
        });
        this.registerUserName = "";
        this.registerPassword = "";
        this.isAdmin  = false;

    };

// log in section
 this.logIn = function(){
   console.log("controller pwd ", this.password);
   $cookies.put("pwd", controller.password); // set pwd for cookies
   $http({
       method:'POST',
       url:'/sessions',
       data: {
           username: this.userName,
           password: this.password,
       }
   }).then(function(response){ //success
     if(response.data == "User is not found") {
       alert('User is not found')
     }else {
       controller.currentUser = response.data.currentuser; // get currrent user information
       $cookies.put('logInSuccess', true);
       $cookies.put("username", response.data.currentuser.username);// set cookies username
       controller.notLogin = false;
//       console.log('current User is: ', controller.currentUser);
     }
       console.log('from log in: ', response.data);
   }, function(error){ //fail
        console.log("wrong user name or password");
        alert("wrong user name or password")
   });
   this.userName = "";
   this.password = "";
 };

this.logout = function(){
 // clean cookies
   alert('trying to log out');
 $cookies.remove('username');
 $cookies.remove('pwd');
 $cookies.remove('logInSuccess');
 $http({
     method:'POST',
     url:'/sessions?_method=DELETE',
     data: {
         username: this.userName,
         password: this.password,
         isAdmin: this.isAdmin
     }
 }).then(function(response){ //success
 }, function(error){ //fail
     alert('can not delete the session');
 });
 this.userName = "";
 this.password = "";
 this.isAdmin  = false;
 console.log('try to reload');
 $window.location.href = 'https://www.google.com/';
 $window.location.reload();
}// end of logout


//set cookie section
  if ($cookies.get('logInSuccess')){
    console.log('on reload');
    console.log("this is a pwd: ", $cookies.get("pwd"));
    this.userName = $cookies.get("username");
    this.password = $cookies.get("pwd");
    this.logIn();
  }


}]); // end of user controller