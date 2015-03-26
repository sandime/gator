// An Angular module is a collection of functions that run when the app is booted.

// app.controller('PlayerController', function($scope, $http, audio) {
var app = angular.module('myApp', []);
    apiKey = 'MDAxMjk1ODg3MDEyOTc4NzE3NDE2MmE5Yg001';
    nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';

app.factory('player', ['audio', '$rootScope', function(audio, $rootScope) {
    var player = {

        current: null,
        progress: 0,
        playing: false,

        play: function(program) {
            if (player.playing)
                player.stop();

            var url = program.audio[0].format.mp4.$text;
            player.current = program;
            audio.src = url;
            audio.play();
            player.playing = true;
        },
        stop: function() {
            if (player.playing) {
                audio.pause();
                player.playing = false;
                player.current = null;
            }
        },
        currentTime: function() {
            return audio.currentTime;
        },
        currentDuration: function() {
            return parseInt(audio.duration);
        }
    };
    audio.addEventListener('timeupdate', function(evt) {
        $rootScope.$apply(function() {
            player.progress = player.currentTime();
            player.progress_percent = (player.progress / player.currentDuration()) * 100;
        });
    });
    audio.addEventListener('ended', function() {
        $rootScope.$apply(player.stop());
    });
    audio.addEventListener('canplay', function() {
        $rootScope.$apply(function() {
            player.ready = true;
        });
    });
    return player;
}]);

app.factory('audio', ['$document', function($document) {
    var audio = $document[0].createElement('audio');
    return audio;
}]);

app.directive('nprLink', function() {
    return {
        restrict: 'EA',
        require: ['^ngModel'],
        replace: true,
        scope: {
            ngModel: '=',
            player: '='
        },
        templateUrl: '/code/views/nprListItem',
        link: function(scope, ele, attr) {
            scope.duration = scope.ngModel.audio[0].duration.$text;
            if (scope.ngModel.image) {
                scope.thumbnail = scope.ngModel.image[0].src;
            }
        }
    }
});

app.directive('playerView', [function(){

    return {
        restrict: 'EA',
        require: ['^ngModel'],
        scope: {
            ngModel: '='
        },
        templateUrl: '/code/views/playerView',
        link: function(scope, iElm, iAttrs, controller) {
            scope.$watch('ngModel.current', function(newVal) {
                if (newVal) {
                    scope.playing = true;
                    scope.duration = parseInt(scope.ngModel.current.audio[0].duration.$text);
                    scope.title = scope.ngModel.current.title.$text;
                    scope.secondsProgress = 0;
                    scope.percentComplete = 0;

                    var updateClock = function() {
                        if (scope.secondsProgress >= scope.duration || !scope.playing) {
                            scope.playing = false;
                            clearInterval(timer);
                        } else {
                            scope.secondsProgress = scope.ngModel.currentTime();
                            scope.percentComplete = scope.secondsProgress / scope.duration;
                        }
                    };
                    var timer = setInterval(function() { scope.$apply(updateClock); }, 500);
                    updateClock();
                }
            });
            scope.stop = function() {
                scope.ngModel.stop();
                scope.playing = false;
            }
        }
    };
}]);

app.factory('nprService', ['$http', function($http) {
    var doRequest = function(apiKey) {
        return $http({
            method: 'JSONP',
            url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
        });
    }

    return {
        programs: function(apiKey) { return doRequest(apiKey); }
    };
}]);

app.controller('PlayerController', ['$scope', '$http', 'player', function($scope, $http, player) {
    $scope.player = player;

    $http({
        method: 'JSONP',
        url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
    }).success(function(data, status) {
        // $scope.programs = data.list.story;
        $scope.programs = [];
        angular.forEach(data.list.story, function(story) {
            if (story.audio[0].format && story.audio[0].format.mp4) {
                console.log(story);
                $scope.programs.push(story);
            }
        });
    }).error(function(data, status) {
    });
}]);

app.controller('RelatedController', ['$scope', '$http', function($scope, $http) {
    $scope.$watch('player.current', function(newVal) {
        if (newVal) {
            $scope.related = [];
            angular.forEach(newVal.relatedLink, function(link) {
                $scope.related.push({link: link.link[0].$text, caption: link.caption.$text});
            });
        }
    });
}]);