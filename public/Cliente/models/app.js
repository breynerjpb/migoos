angular.module('Miggos_Module', ['ngStorage', 'ngResource', 'ngMessages', 'ngAnimate', 'toastr', 'ui.router', 'satellizer'])

.config(function ($stateProvider, $httpProvider,$authProvider,$urlRouterProvider) {

        $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('login', {
        url: '/',
        templateUrl: 'views/login.html',
        controller: 'HomeCtrl',
            authenticate: true
      }).state('home', {
        url: '/app/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        authenticate: true
      });

        $authProvider.facebook({
            clientId: '1644093429237311',
            url: 'http://localhost:3000/auth/facebook',
            redirectUri: 'http://localhost:63342/MigoosA/' || 'http://localhost:63342/MigoosA/index.html#/home'
        });//'http://localhost/Miggos/'

        $authProvider.twitter({
            url: 'http://localhost:3000/auth/twitter',
            redirectUri: 'http://localhost:63342/MigoosA/#/app/home' || 'http://localhost:63342/MigoosA/index.html#/home'
        });//'http://localhost/Miggos/'

        $authProvider.google({
          clientId: '504744434203-26pbj9oojmjjkbpidmsf81rtjulceplp.apps.googleusercontent.com',
            url: 'http://localhost:3000/auth/google',
            redirectUri: 'http://localhost:63342/MigoosA/#/app/home' || 'http://localhost:63342/MigoosA/index.html#/home'
            //'http://localhost/Miggos/#'
        });
        // OAuth 2.0
        $authProvider.oauth2({
              name: 'foursquare',
              url: '/auth/foursquare',
              clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
              redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
              authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
            });


    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage,toastr) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.datos) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.datos;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        toastr.error(response.status);
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);
/*
    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        //deferred.resolve();
        $location.path('#/home');
      } else {
          alert("No tiene autorizacion");
        $location.path('#/');
      }
      //return deferred.promise;
    }

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }
*/
    }
).run(function ($rootScope, $location, $auth,$window,toastr) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        if ($auth.isAuthenticated()) {
               /* $rootScope.returnToState = toState.url;
                $rootScope.returnToStateParams = toParams.Id;*/
                $location.path('app/home');
            }else{
            $location.path('/');
        }
    });

    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
            toastr.error("Verifique la conexión a internet y vuelva a intentarlo mas tarde! \n y no te desconectes de Migoos.");
        });
    }, false);

    $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);
});
