// An Angular module is a collection of functions that run when the app is booted.
var app = angular.module('myApp', []);

//root controller
app.controller('PlayerController', ['$scope', function($scope) {
    $scope.playing = false;
    $scope.audio = document.createElement('audio');
    $scope.audio.src = '/media/npr.mp4';
    $scope.play = function() {
        $scope.audio.play();
        $scope.playing = true;
    };
    $scope.stop = function() {
        $scope.audio.pause();
        $scope.playing = false;
    };
    $scope.audio.addEventListener('ended', function() {
        $scope.$apply(function() {
            $scope.stop()
        });
    });
}]);
//controller fetches prgm listings
app.controller('RelatedController', ['$scope', function ($scope){
$scope.audio = documnet.createElement('audio');
    $scope.audio.src = '/media/npr.mp4';
}]);