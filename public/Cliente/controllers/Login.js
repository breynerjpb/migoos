'use strict';

/* Controllers */

angular.module('Miggos_Module')
    .controller('HomeCtrl',function($rootScope, $scope, $location, $localStorage, Main, $auth, toastr) {

        try{
            $scope.signin = function() {
                var formData = {
                    Email: $scope.Email,
                    Contrasena: $scope.Contrasena
                }
                Main.signin(formData, function(res) {
                    if (res.type == false) {
                        toastr.error(res.message || res.data);
                    } else {

                        if(res.message==undefined || res.message=="" || res.success) {
                            toastr.success("Bienevenido a Migoos");

                            var token = JSON.parse(res.token);
                            $localStorage.datos = token.token;
                            $auth.setToken(token.token);
                            $location.path("app/home");
                        }else{
                            toastr.info(res.message);
                        }
                        /*Main.perfil(function(res){
                         window.location.href = "/perfil";
                         });*/

                    }
                }, function(error) {
                    //$rootScope.error = 'Failed to signin';
                    toastr.error(error);
                })
            };


        $scope.me = function() {
            Main.me(function(res) {
                $scope.Datos = res;
            }, function(error) {
                toastr.error(error.message);
            })
        };

        $scope.logout = function() {
            /*Main.logout(function() {
                window.location = "#/"
                delete  $localStorage.datos, $localStorage.satellizer_token;
            }, function() {
                alert("Failed to logout!");
            });*/
            if (!$auth.isAuthenticated()) { return; }
            $auth.logout()
                .then(function() {
                    delete  $localStorage.datos;
                    toastr.info('Gracias por conectarte con Migoos esperamos que vuelvas pronto!');
                    $location.path('/');
                });
        };
        $scope.authenticate = function(provider) {
              $auth.authenticate(provider)
                .then(function(response) {
                  var token=response.data.token;
                  if (token!="" && token!='undefined') {
                      var token = JSON.parse(response.data.token);
                      $localStorage.datos = token.token;
                      $location.path('app/home');
                  }
                  //$location.path('#/');
                  //$localStorage.token =provider.token;
                })
                .catch(function(error) {
                  if (error.error) {
                    // Popup error - invalid redirect_uri, pressed cancel button, etc.
                    toastr.error(error.error);
                  } else if (error.data) {
                    // HTTP response error from server
                      toastr.error(error.data.message, error.status);
                  }else if(error.message){
                      toastr.error(error.message);
                      //console.error(error.message);
                  } else {
                      toastr.error(error);
                  }
                  $location.path("/");
                });
        };
        }catch (ex){
            toastr.error("Error..."+ex);
        }
       // $scope.token = $localStorage.token;
    })
    .controller('registrarCtrl',function($rootScope, $scope, $location, $localStorage, Main, $auth, toastr) {
        try {


            $scope.signup = function () {
                var formData = {
                    regis_Email: $scope.regis_Email,
                    regis_Clave: $scope.regis_Contrasena,
                    regis_Nombres: $scope.regis_Nombres,
                    regis_Apellidos: $scope.regis_Apellidos
                }
                if ($scope.regis_Email != "" && $scope.regis_Contrasena != ""
                    && $scope.regis_Nombres != "" && $scope.regis_Apellidos != ""
                    && $scope.regis_Repetir_Contrasena != "") {
                    if ($scope.regis_Contrasena == $scope.regis_Repetir_Contrasena) {
                        Main.save(formData, function (res) {
                            if (res.type == false) {
                                toastr.info(res.message)
                            } else {
                                /*$localStorage.token = res.token;*/
                                $location.path("/");
                                toastr.info("Gracias por unirte a Migoos, esperamos que te conectes para ver tus eventos favoritos!");
                                logiar();
                            }
                        }, function () {
                            $rootScope.error = 'Failed to signup';
                        })
                    } else {
                        alert("Las contraseñas deben coincidir!");
                    }
                } else {
                    alert("Debe llenar todos los campos!");
                }
                ;
            }
        }catch (ex){
            toastr.arror("Error..."+ex);
        }
    })
    .controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main','toastr', function($rootScope, $scope, $location, Main,toastr) {
try {
    Main.me(function (res) {
        $scope.myDetails = res;
    }, function (error) {
        //$rootScope.error = 'Failed to fetch details';
        toastr.arror("Error..." + error);
    });
}catch (ex){
    toastr.error("Error..."+ex);
}
    }]);
