angular.module("myApp.controllers", []).controller("resumeCtrl", function ($scope, resumeService) {
    // Write your code here
    $scope.resumes = resumeService.get();

    $scope.newResumes = {};

    $scope.isEmpty = function(str) {
      return String(str).length == 0;
    };

    $scope.addResumes = function (artist, title) {
        $scope.resumes.push({
            artist: artist,
            title: title
        });
        $scope.newResumes.title = "";
        $scope.newResumes.artist = "";

    };

  $scope.$watch("resumes", function (newValue, oldValue) {
    if (newValue !== oldValue) {

      $scope.resumes.map(function(a){
        var c = $scope.resumes.map(function(b){
          if(a == b){
            return false;
          }
        });
        console.log(c);
      });
    }
}, true);
});
