function maReferenceManyField(ReferenceRefresher) {
    'use strict';

    return {
        scope: {
            'field': '&',
            'value': '=',
            'entry':  '=?',
            'datastore': '&?'
        },
        restrict: 'E',
        link: function(scope) {
            var field = scope.field();
            scope.name = field.name();
            scope.v = field.validation();
            scope.choices = [];

            scope.refresh = function(search) {
                return ReferenceRefresher.refresh(field, scope.value, search)
                    .then(formattedResults => {
                        scope.$broadcast('choices:update', { choices: formattedResults });
                    });
            };
        },
        template: `<ma-choices-field
                field="field()"
                datastore="datastore()"
                refresh="refresh($search)"
                value="value">
            </ma-choice-field>`
    };
}

maReferenceManyField.$inject = ['ReferenceRefresher'];

module.exports = maReferenceManyField;