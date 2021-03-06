angular.module('signin', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'signinController',
            templateUrl: '/views/login/signin.html'
        })
        .when('/set-password/:id', {
            controller: 'setPasswordController',
            templateUrl: '/views/login/set-password.html'
        })
        .otherwise({redirectTo: '/'  });
});
