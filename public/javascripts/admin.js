angular.module('admin', ['ngRoute', 'ui.tinymce', 'colorpicker.module', 'ui.date', 'angularCharts'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                controller: 'homeController',
                templateUrl: '/views/admin/home.html'
            })
            .when('/companies', {
                controller: 'companyController',
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
            .when('/pages', {
                controller: 'pagesController',
                templateUrl: '/views/pages/index.html'
            })
            .when('/pages/new', {
                controller: 'pageEditorController',
                templateUrl: '/views/pages/editor.html'
            })
            .when('/pages/:id', {
                controller: 'pageEditorController',
                templateUrl: '/views/pages/editor.html'
            })
            .when('/customPages', {
                controller: 'customPagesController',
                templateUrl: '/views/customPages/index.html'
            })
            .when('/customPages/new', {
                controller: 'customPageEditorController',
                templateUrl: '/views/customPages/editor.html'
            })
            .when('/customPages/:id', {
                controller: 'customPageEditorController',
                templateUrl: '/views/customPages/editor.html'
            })
            .when('/customPages/delete/:id', {
                controller: 'customPagesDeleteController',
                templateUrl: '/views/customPages/delete.html'
            })
            .when('/reports/:pageType/:id', {
                controller: 'reportsController',
                templateUrl: '/views/reports/index.html'
            })
            .when('/campaigns', {
                controller: 'campaignsController',
                templateUrl: '/views/campaigns/index.html'
            })
            .when('/campaigns/new', {
                controller: 'campaignEditorController',
                templateUrl: '/views/campaigns/editor.html'
            })
            .when('/campaigns/:id', {
                controller: 'campaignEditorController',
                templateUrl: '/views/campaigns/editor.html'
            })
            .when('/contacts', {
                controller: 'contactsController',
                templateUrl: '/views/contacts/index.html'
            })
            .when('/contacts/new', {
                controller: 'contactEditorController',
                templateUrl: '/views/contacts/editor.html'
            })
            .when('/contacts/:id', {
                controller: 'contactEditorController',
                templateUrl: '/views/contacts/editor.html'
            })
            .otherwise({ redirectTo: '/' });

        // Interceptors
        $httpProvider.responseInterceptors.push('httpInterceptor');
        $httpProvider.defaults.transformRequest.push(function (data, headersGetter) {
            $('#loading').show();
            return data;
        });
    });