'use strict';

/**
 * @ngdoc overview
 * @name traffic-monitor
 * @description
 * # traffic-monitor
 *
 * Main module of the application.
 */
var app = angular.module('traffic-monitor', [
  'ui.router',
  'ncy-angular-breadcrumb',
  'angular-loading-bar',
  'dndLists',
  'leaflet-directive'
]);



app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push(function($q, $location) {
    return {
      'responseError': function(rejection) {
        if (rejection.status === 401) {
          $location.url("/");
        }
        return $q.reject(rejection);
      }
    };
  });
}]);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    templateUrl: 'views/main.html'
  });

  $stateProvider.state('app.home', {
    url: '/home',
    templateUrl: 'views/home/home.html',
    controller: 'MainCtrl',
    data: {
      title: 'Home'
    },
    ncyBreadcrumb: {
      label: 'Home'
    }
  });




  $stateProvider.state('app.dash', {
    url: '/dash',
    templateUrl: 'views/home/dash.html',
    data: {
      title: 'Dash'
    },
    ncyBreadcrumb: {
      label: 'Dash'
    }
  });

  $urlRouterProvider.otherwise('/app/home');
});

app.constant('serverUrl', 'localhost:3000');
app.constant('locationIQ', 'e9fbe60b2244e1a62302');
