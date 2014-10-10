angular.module('clicks', ['ngRoute', 'ui.tinymce', 'colorpicker.module', 'ui.date', 'angularCharts','click-interceptor','angularFileUpload','angularUtils.directives.dirPagination'])
    .config(function ($routeProvider, $httpProvider) {
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
            .when('/layouts/delete/:id', {
                controller: 'layoutDeleteController',
                templateUrl: '/views/layouts/delete.html'
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
            .when('/pages/delete/:id', {
                controller: 'pageDeleteController',
                templateUrl: '/views/pages/delete.html'
            })
            .when('/customPages', {
                controller: 'customPagesController',
                templateUrl: '/views/customPages/index.html'
            })
            .when('/customPages/new/:staticId?', {
                controller: 'customPageEditorController',
                templateUrl: '/views/customPages/editor.html'
            })
            .when('/customPages/:id', {
                controller: 'customPageEditorController',
                templateUrl: '/views/customPages/editor.html'
            })
            .when('/customPages/delete/:id', {
                controller: 'customPageDeleteController',
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
            .when('/campaigns/delete/:id', {
                controller: 'campaignDeleteController',
                templateUrl: '/views/campaigns/delete.html'
            })
            .when('/contacts', {
                controller: 'contactsController',
                templateUrl: '/views/contacts/index.html'
            })
            .when('/contacts/new', {
                controller: 'contactEditorController',
                templateUrl: '/views/contacts/editor.html'
            })
            .when('/contacts/upload', {
                controller: 'contactUploadController',
                templateUrl: '/views/contacts/upload.html'
            })
            .when('/contacts/:id', {
                controller: 'contactEditorController',
                templateUrl: '/views/contacts/editor.html'
            })
            .when('/contacts/delete/:id', {
                controller: 'contactDeleteController',
                templateUrl: '/views/contacts/delete.html'
            })
            .otherwise({ redirectTo: '/' });

        // Interceptors
        $httpProvider.responseInterceptors.push('httpInterceptor');
        $httpProvider.defaults.transformRequest.push(function (data, headersGetter) {
            $('#loading').show();
            return data;
        });
    });