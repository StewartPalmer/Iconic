﻿angular.module("umbraco").controller("Koben.IconPicker.Prevalues.Packages", ['$scope', '$http', 'assetsService', function ($scope, $http, assetsService) {

    $scope.newItem = {
        alias: "",
        name: "",
        selector: "",
        extraClasses: "",
        cssfile: "",
        extractedStyles: []
    }

    $scope.currentItem;
    $scope.analysing = "init";
    $scope.newItemFormErrors = [];

    $scope.addNewItem = function () {
        if (!angular.isArray($scope.model.value)) $scope.model.value = [];
        $scope.newItemFormErrors = []; //remove errors

        if (!$scope.newItem.alias) $scope.newItemFormErrors.alias = true;
        if (!$scope.newItem.name) $scope.newItemFormErrors.name = true;
        if (!$scope.newItem.selector) $scope.newItemFormErrors.selector = true;
        if (!$scope.newItem.cssfile) $scope.newItemFormErrors.cssfile = true;
        if (!$scope.newItem.extractedStyles.length > 0) $scope.newItemFormErrors.extractedStyles = true;

        if (Object.keys($scope.newItemFormErrors).length > 0) return;

        $scope.model.value.push(angular.copy($scope.newItem));
        $scope.newItem = {};
    }

    $scope.selectItem = function (item) {
        if ($scope.currentItem === item)
            $scope.currentItem = null;
        else
            $scope.currentItem = item;
    }

    $scope.removeItem = function (item) {

        $scope.model.value = _.reject($scope.model.value, function (x) {
            return x.alias === item.alias;
        });
    }

    $scope.hideItemForm = function () {
        $scope.showNewItemForm = false;
    }



    $scope.extractStyles = function (item) {
        $scope.analysing = "busy";
        $scope.newItemFormErrors = [];

        if (!$scope.newItem.selector || $scope.newItem.selector.length <= 0) {
            $scope.newItemFormErrors.selector = true;
            return;
        }

        
        $http.get(item.cssfile).success(function (data) {
            item.extractedStyles = [];
            var pattern = new RegExp(item.selector, 'g');

            var match = pattern.exec(data);
            while (match !== null) {
                item.extractedStyles.push(match[1])
                match = pattern.exec(data);
            }

            if (item.extractedStyles.length > 0) {

                assetsService.loadCss(item.cssfile).then(function () {
                    $scope.analysing = "success";
                });
            } else {
                $scope.analysing = "error";
                //if matches are 0 it's probably because the regex is wrong.
                $scope.newItemFormErrors.selector = true;
                return;
                
            }

        }).error(function (response) {
            $scope.analysing = "error";
        })

    }

    //$scope.model.value = [{
    //    alias: 'glyphicons',
    //    name: 'Glyphicons',
    //    selector: '\\.(glyphicon-[\\w-]+):before{',
    //    extraClasses: 'glyphicon',
    //    cssfile: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
    //}, {
    //    alias: 'fa',
    //    name: 'Font Awesome',
    //    selector: '\\.(fa-[\\w-]+):before{',
    //    extraClasses: 'fa',
    //    cssfile: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
    //},
    //{
    //    alias: 'fi',
    //    name: 'Foundation Icons',
    //    selector: '\\.(fi-[\\w-]+):before{',
    //    extraClasses: '',
    //    cssfile: 'https://cdn.jsdelivr.net/foundation-icons/3.0/foundation-icons.min.css'
    //}];


}]);