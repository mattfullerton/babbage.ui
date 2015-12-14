angular.module('ngBabbage.templates', ['babbage-templates/babbage.html', 'babbage-templates/chart.html', 'babbage-templates/crosstab.html', 'babbage-templates/facts.html', 'babbage-templates/pager.html', 'babbage-templates/panel.html', 'babbage-templates/sankey.html', 'babbage-templates/treemap.html', 'babbage-templates/workspace.html']);

angular.module("babbage-templates/babbage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("babbage-templates/babbage.html",
    "<div class=\"babbage-frame\" ng-transclude></div>");
}]);

angular.module("babbage-templates/chart.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("babbage-templates/chart.html",
    "<div class=\"table-babbage\" ng-hide=\"queryLoaded\"><div class=\"alert alert-info\"><strong>You have not selected any data.</strong> Please choose the configuration for your chart.</div></div><div class=\"alert alert-warning\" ng-show=\"cutoffWarning\"><strong>Too many categories.</strong> There are more than {{cutoff}} items in the selected drilldown.</div><div class=\"chart-babbage\"><svg></svg></div>");
}]);

angular.module("babbage-templates/crosstab.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("babbage-templates/crosstab.html",
    "<div class=\"table-babbage\" ng-show=\"rows.length\"><table class=\"table table-bordered table-condensed\"><thead><tr ng-repeat=\"x in columns[0]\"><th ng-repeat=\"r in rows[0]\"></th><th ng-repeat=\"c in columns\">{{c[$parent.$index]}}</th></tr></thead><tbody><tr ng-repeat=\"row in rows\"><th ng-repeat=\"r in row\">{{r}}</th><td ng-repeat=\"val in table[$index] track by $index\" class=\"numeric\">{{val | numeric}}</td></tr></tbody></table></div><div class=\"table-babbage\" ng-hide=\"rows.length || !queryLoaded\"><div class=\"alert alert-info\"><strong>You have not selected any data.</strong> Please choose a set of rows and columns to generate a cross-table.</div></div>");
}]);

angular.module("babbage-templates/facts.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("babbage-templates/facts.html",
    "<div class=\"table-babbage\" ng-show=\"data\"><table class=\"table table-bordered table-striped table-condensed\"><thead><tr><th ng-repeat-start=\"c in columns\" class=\"title\">{{ c.header }} <span class=\"sublabel\" ng-hide=\"c.hide\">{{ c.label }}</span></th><th ng-repeat-end class=\"operations\" ng-switch=\"getSort(c.ref).direction\"><span ng-switch-when=\"desc\" ng-click=\"pushSort(c.ref, 'asc')\" class=\"ng-link\"><i class=\"fa fa-sort-desc\"></i></span> <span ng-switch-when=\"asc\" ng-click=\"pushSort(c.ref, 'desc')\" class=\"ng-link\"><i class=\"fa fa-sort-asc\"></i></span> <span ng-switch-default ng-click=\"pushSort(c.ref, 'desc')\" class=\"ng-link\"><i class=\"fa fa-sort\"></i></span></th></tr></thead><tbody><tr ng-repeat=\"row in data\"><td ng-repeat=\"c in columns\" ng-class=\"{'numeric': c.numeric}\" class=\"simple\" colspan=\"2\"><span ng-if=\"c.numeric\">{{ row[c.ref] | numeric }}</span> <span ng-if=\"!c.numeric\">{{ row[c.ref] }}</span></td></tr></tbody></table></div><babbage-pager context=\"pagerCtx\"></babbage-pager>");
}]);

angular.module("babbage-templates/pager.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("babbage-templates/pager.html",
    "<ul ng-show=\"showPager\" class=\"pagination pagination-sm\"><li ng-class=\"{'disabled': !hasPrev}\"><a class=\"ng-link\" ng-click=\"setPage(current - 1)\">&laquo;</a></li><li ng-repeat=\"page in pages\" ng-class=\"{'active': page.current}\"><a class=\"ng-link\" ng-click=\"setPage(page.page)\">{{page.page + 1}}</a></li><li ng-class=\"{'disabled': !hasNext}\"><a class=\"ng-link\" ng-click=\"setPage(current + 1)\">&raquo;</a></li></ul>");
}]);

angular.module("babbage-templates/panel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("babbage-templates/panel.html",
    "<div class=\"panel panel-default\" ng-repeat=\"axis in axes\"><div class=\"panel-heading\" ng-if=\"axis.label == 'Tiles'\"><strong>Anzeige nach:</strong><div class=\"btn-group\" dropdown ng-show=\"axis.available.length\">&nbsp;&nbsp; <a dropdown-toggle class=\"ng-link\">&#x21d3;</a><ul class=\"dropdown-menu\" role=\"menu\"><li ng-repeat=\"opt in axis.available\"><a ng-click=\"add(axis, opt.ref)\" ng-if=\"['Einzelplanbezeichnung', 'Hauptgruppenbezeichnung', 'Hauptfunktionbezeichnung'].indexOf(opt.subLabel) > -1\"><strong ng-if=\"opt.subLabel == 'Einzelplanbezeichnung'\">Organisation</strong> <strong ng-if=\"opt.subLabel == 'Hauptgruppenbezeichnung'\">Gruppe</strong> <strong ng-if=\"opt.subLabel == 'Hauptfunktionbezeichnung'\">Funktion</strong></a></li></ul></div></div><table class=\"table\" ng-if=\"axis.label == 'Tiles'\"><tr ng-repeat=\"opt in axis.active\"><td colspan=\"2\"><div class=\"pull-right\"><a ng-click=\"remove(axis, opt.ref)\" ng-show=\"axis.remove\" class=\"ng-link ng-icon\"><i class=\"fa fa-times\"></i></a></div><strong ng-if=\"opt.subLabel == 'Einzelplanbezeichnung'\">Organisation</strong> <strong ng-if=\"opt.subLabel == 'Hauptgruppenbezeichnung'\">Gruppe</strong> <strong ng-if=\"opt.subLabel == 'Hauptfunktionbezeichnung'\">Funktion</strong></td></tr></table></div><div class=\"panel panel-default\"><div class=\"panel-heading\"><strong>Einnahmen oder Ausgaben</strong><div class=\"btn-group\" dropdown ng-show=\"filterAttributes.length\"></div></div><table class=\"table table-panel\"><tbody ng-repeat=\"filter in filters\"><tr><td colspan=\"2\"></td><td width=\"1%\"></td></tr><tr class=\"adjoined\"><td width=\"0%\" class=\"middle\"></td><td width=\"95%\"><ui-select ng-model=\"filter.value\" disable-search=\"false\" on-select=\"setFilter(filter, $item, $model)\"><ui-select-match placeholder=\"Pick one...\">{{$select.selected}}</ui-select-match><ui-select-choices repeat=\"v as v in filter.values | filter: $select.search track by $index\"><div ng-bind=\"v\"></div></ui-select-choices></ui-select></td><td class=\"middle\"></td></tr></tbody></table></div>");
}]);

angular.module("babbage-templates/sankey.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("babbage-templates/sankey.html",
    "<div class=\"table-babbage\" ng-hide=\"queryLoaded\"><div class=\"alert alert-info\"><strong>You have not selected any data.</strong> Please choose a breakdown for both sides of the flow diagram.</div></div><div class=\"alert alert-warning\" ng-show=\"cutoffWarning\"><strong>Too many links.</strong> The source and target you have selected have many different links, only the {{cutoff}} biggest are shown.</div><div class=\"sankey-babbage\"></div>");
}]);

angular.module("babbage-templates/treemap.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("babbage-templates/treemap.html",
    "<div class=\"table-babbage\" ng-hide=\"queryLoaded\"><div class=\"alert alert-info\"><strong>You have not selected any data.</strong> Please choose a breakdown for your treemap.</div></div><div class=\"alert alert-warning\" ng-show=\"cutoffWarning\"><strong>Too many tiles.</strong> The breakdown you have selected contains many different categories, only the {{cutoff}} biggest are shown.</div><div class=\"treemap-babbage\"></div>");
}]);

angular.module("babbage-templates/workspace.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("babbage-templates/workspace.html",
    "<babbage endpoint=\"{{endpoint}}\" cube=\"{{cube}}\" state=\"state\" update=\"update(state)\"><div class=\"row\"><div class=\"col-md-9\"><div ng-if=\"view == 'crosstab'\"><babbage-crosstab></babbage-crosstab></div><div ng-if=\"view == 'facts'\"><babbage-facts></babbage-facts></div><div ng-if=\"view == 'treemap'\"><babbage-treemap></babbage-treemap></div><div ng-if=\"view == 'barchart'\"><babbage-chart chart-type=\"bar\"></babbage-chart></div><div ng-if=\"view == 'linechart'\"><babbage-chart chart-type=\"line\"></babbage-chart></div><div ng-if=\"view == 'sankey'\"><babbage-sankey></babbage-sankey></div></div><div class=\"col-md-3\"><babbage-panel></babbage-panel></div></div></babbage>");
}]);
