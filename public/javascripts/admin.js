angular.module('admin', ['ngRoute', 'ui.tinymce', 'colorpicker.module', 'ui.date', 'angularCharts','click-interceptor'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                controller: 'homeController',
                templateUrl: '/views/admin/home.html'
            })
            .when('/companies', {
                controller: 'companiesController',
                templateUrl: '/views/admin/companies/index.html'
            })
            .when('/companies/new', {
                controller: 'companyEditorController',
                templateUrl: '/views/admin/companies/editor.html'
            })
            .when('/companies/:id', {
                controller: 'companyEditorController',
                templateUrl: '/views/admin/companies/editor.html'
            })
            .when('/companies/delete/:id', {
                controller: 'companyDeleteController',
                templateUrl:'/views/admin/companies/delete.html'
            })
            .when('/users', {
                controller: 'usersController',
                templateUrl: '/views/admin/users/index.html'
            })
            .when('/users/new', {
                controller: 'userEditorController',
                templateUrl: '/views/admin/users/editor.html'
            })
            .when('/users/:id', {
                controller: 'userEditorController',
                templateUrl: '/views/admin/users/editor.html'
            })
            .when('/users/delete/:id', {
                controller: 'userDeleteController',
                templateUrl: '/views/admin/users/delete.html'
            })
            .otherwise({ redirectTo: '/' });

        // Interceptors
        $httpProvider.responseInterceptors.push('httpInterceptor');
        $httpProvider.defaults.transformRequest.push(function (data, headersGetter) {
            $('#loading').show();
            return data;
        });
    });