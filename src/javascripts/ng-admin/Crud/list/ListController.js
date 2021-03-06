/*global define*/

define(function () {
    'use strict';

    var ListController = function ($scope, $stateParams, $location, $anchorScroll, ReadQueries, progression, view, dataStore, totalItems) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.ReadQueries = ReadQueries;
        this.progression = progression;
        this.view = view;
        this.entity = view.getEntity();
        this.loadingPage = false;
        this.search = $stateParams.search;
        this.dataStore = dataStore;
        this.fields = view.fields();
        this.listActions = view.listActions();
        this.totalItems = totalItems;
        this.page = $stateParams.page || 1;
        this.infinitePagination = this.view.infinitePagination();
        this.nextPageCallback = this.nextPage.bind(this);
        this.setPageCallback = this.setPage.bind(this);
        this.sortField = this.$stateParams.sortField || this.view.getSortFieldName();
        this.sortDir = this.$stateParams.sortDir || this.view.sortDir();

        if ($scope.selectionUpdater) {
            $scope.selection = $scope.selection || [];
            $scope.$watch('selection', $scope.selectionUpdater);
        } else {
            $scope.selection = null;
        }
        

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.nextPage = function (page) {
        if (this.loadingPage) {
            return;
        }

        var progression = this.progression,
            self = this;

        progression.start();

        this.ReadQueries
            .getAll(this.view, page, this.search, this.sortField, this.sortDir)
            .then(function (response) {
                progression.done();
                var references = self.view.getReferences();

                self.dataStore.mapEntries(
                    self.entity.name(),
                    self.view.identifier(),
                    self.fields,
                    response.data
                ).map(function (entry) {
                    self.dataStore.fillReferencesValuesFromEntry(entry, references, true);
                    self.dataStore.addEntry(self.entity.uniqueId, entry);
                });

                self.loadingPage = false;
            });
    };

    ListController.prototype.setPage = function (number) {
        this.$location.search('page', number);
        this.$anchorScroll(0);
    };


    ListController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$stateParams = undefined;
        this.$location = undefined;
        this.$anchorScroll = undefined;
        this.dataStore = undefined;
    };

    ListController.$inject = ['$scope', '$stateParams', '$location', '$anchorScroll', 'ReadQueries', 'progression', 'view', 'dataStore', 'totalItems'];

    return ListController;
});
