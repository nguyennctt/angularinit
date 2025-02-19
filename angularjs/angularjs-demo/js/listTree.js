var app = angular.module("listTree", []);

app.controller("tree", ['$scope', '$compile', function ($scope, $compile) {
    $scope.catalog = [
        {name: "Chapter 1", children: ["So luoc ve to hop, nhac lai ly thuyet tap hop", "mot so nguyen ly co ban"]},
        {name: "Chapter 2", children: ["Bai toan dem", "Gioi thieu bai toan"]},
        {name: "Chapter 3", children: ["Bai toan ton tai"]}
    ]

}]);

app.factory("RecursionHelper", ['$compile', function ($compile) {
    return {
        compile: function(element, link){
            // Normalize the link parameter
            if(angular.isFunction(link)){
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function(scope, element){
                    // Compile the contents
                    if(!compiledContents){
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function(clone){
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if(link && link.post){
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
}])
    .directive("hierarchy", function (RecursionHelper) {
        return{
            restrict: "A",
            scope: {
                catalog: '='
            },
            template:
                '<ul>'
                + '<li ng-repeat="ca in catalog">'
                + '<div class="catalog" ng-class="{\'expanded\': catalog.isExpanded && catalog.isExpanded.val == true}" ng-click="catalog.isExpanded.val = !catalog.isExpanded.val">'
                + '<tree catalog="ca"></tree>'
                + '<img src="../images/hierarchy-expand.svg" class="hierarchy-expand" alt="">'
                + '<img src="../images/hierarchy-collapse.svg" class="hierarchy-collapse" alt="">'
                + '<span ng-bind="ca.name"></span></div>'
                + '<ul><li ng-show="catalog.isExpand.val == true" ng-repeat="child in ca.children">'
                + '<tree catalog="child"></tree><span ng-bind="child"></span> '
                + '</li></ul>'
                + '</li></ul>',
            compile: function (element) {
                return RecursionHelper.compile(element, function (scope, iElement, iAttrs, controller, transcludeFn) {

                })
            }
        }
    });