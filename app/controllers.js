angular.module("myApp.controllers", []).controller("resumeCtrl", function($scope) {
  // Write your code here
  $scope.resumes = [{
  artist: "Nightwish",
  title: "Ghost Loves Score"
}, {
  artist: "Evanescence",
  title: "Everybody's Fool"
}, {
  artist: "Within Temptation",
  title: "Ice Queen"
}];
});