'use strict';

angular.module('Miggos_Module')
    .factory('Main', ['$http', '$localStorage', function($http, $localStorage){
        var baseUrl = "https://prueba-migoos.herokuapp.com";
        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined' && token!="" && token!=null) {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();

        return {
            save: function(data, success, error) {
                $http.post(baseUrl + '/Registrar', data).success(success).error(error)
            },
            signin: function(data, success, error) {
                $http.post(baseUrl + '/', data).success(success).error(error)
            },
            me: function(success, error) {
                $http.get(baseUrl + '/usuarios').success(success).error(error)
            },
            perfil: function(success, error) {
                $http.get(baseUrl + '/perfil').success(success).error(error)
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            }
        };
    }
]);