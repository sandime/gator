// An Angular module is a collection of functions that run when the app is booted.


var apiKey = "MDAxMjk1ODg3MDEyOTc4NzE3NDE2MmE5Yg001",
    nprUrl= 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON'
var app = angular.module('myApp', []);
app.controller('PlayerController', function($scope, $http) {


//root controller
//app.controller('PlayerController', ['$scope', function($scope) {
    /*
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
    */
$http({
    method: 'JSONP',
    url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
}).success(function(data, status) {
    // Now we have a list of the stories (data.list.story)
    // in the data object that the NPR API
    // returns in JSON that looks like:
    // data: { "list": {
    //   "title": ...
    //   "story": [
    //     { "id": ...
    //       "title": ...
    //bind the list of clips to the $scope obj by storing list on $scope in the success callback
    $scope.programs = data.list.story;
}).error(function(data, status) {
    // Some error occurred
});
});