var app = angular.module('clicks', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'homeController',
            templateUrl: '/views/home/index.html'
        })
        .when('/layouts', {
            controller: 'layoutsController',
            templateUrl: '/views/layouts/index.html'
        })
        .when('/layouts/new', {
            controller: 'layoutEditorController',
            templateUrl: '/views/layouts/editor.html'
        })
        .when('/layouts/:id', {
            controller: 'layoutEditorController',
            templateUrl: '/views/layouts/editor.html'
        })
        .otherwise({ redirectTo: '/' });
});