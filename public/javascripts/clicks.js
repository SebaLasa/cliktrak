var app = angular.module('clicks', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'homeController',
            templateUrl: '/views/home/index.html'
        })
        .otherwise({ redirectTo: '/' });
});