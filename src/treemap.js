
ngBabbage.directive('babbageTreemap', ['$rootScope', '$http', '$document', function($rootScope, $http, $document) {
  return {
  restrict: 'EA',
  require: '^babbage',
  scope: {
    drilldown: '='
  },
  templateUrl: 'babbage-templates/treemap.html',
  link: function(scope, element, attrs, babbageCtrl) {
    var treemap = null,
        div = null;

    scope.queryLoaded = false;
    scope.cutoffWarning = false;

    var query = function(model, state) {
      var tile = asArray(state.tile)[0],
          area = asArray(state.area)[0],
          area = area ? [area] : defaultArea(model);

      var q = babbageCtrl.getQuery();
      q.aggregates = area;
      if (!tile) {
        return;
      }
      q.drilldown = [tile];

      var order = [];
      for (var i in q.order) {
        var o = q.order[i];
        if ([tile, area].indexOf(o.ref) != -1) {
          order.push(o);
        }
      }
      if (!order.length) {
        order = [{ref: area, direction: 'desc'}];
      }

      q.order = order;
      q.page = 0;
      q.pagesize = 50;
      
      scope.cutoffWarning = false;
      scope.queryLoaded = true;
      var dfd = $http.get(babbageCtrl.getApiUrl('aggregate'),
                          babbageCtrl.queryParams(q));

      var wrapper = element.querySelectorAll('.treemap-babbage')[0],
          size = babbageCtrl.size(wrapper, function(w) { return w * 0.6; });

      treemap = d3.layout.treemap()
        .size([size.width, size.height])
        .sticky(true)
        .sort(function(a, b) { return a[area] - b[area]; })
        .value(function(d) { return d[area]; });

      d3.select(wrapper).select("div").remove();
      div = d3.select(wrapper).append("div")
        .style("position", "relative")
        .style("width", size.width + "px")
        .style("height", size.height + "px");

      dfd.then(function(res) {
        queryResult(res.data, q, model, state);
      });
    };

    var queryResult = function(data, q, model, state) {
      var drilldown = q.drilldown && q.drilldown.split("\.");
      if (drilldown && drilldown.length > 0) {
        drilldown = drilldown[0];
      }
      var next = undefined;
      switch (drilldown) {
        //Idea: Include E/A in the treemap to show the "schwarze Null"
        //case "einnahmeausgabe":
          //next = "einzelplan.einzelplanbezeichnung";
          //break;
        case "einzelplan":
          next = "kapitel.kapitelbezeichnung";
          break;
        case "kapitel":
          next = "zweckbestimmung.zweckbestimmung";
          break;
        case "hauptgruppe":
          next = "obergruppe.obergruppenbezeichnung";
          break;
        case "obergruppe":
          next = "gruppe.gruppenbezeichnung";
          break;
        case "hauptfunktion":
          next = "oberfunktion.oberfunktionbezeichnung";
          break;
        case "oberfunktion":
          next = "funktion.funktionbezeichnung";
          break;
      }
      var tileRef = asArray(state.tile)[0],
          areaRef = asArray(state.area)[0],
          areaRef = areaRef ? [areaRef] : defaultArea(model);

      var root = {
        children: []
      };

      for (var i in data.cells) {
        var cell = data.cells[i];
        cell._area_fmt = ngBabbageGlobals.numberFormat(Math.round(cell[areaRef]));
        cell._name = cell[tileRef];
        cell._color = ngBabbageGlobals.colorScale(i);
        cell._percentage = cell[areaRef] / Math.max(data.summary[areaRef], 1);
        root.children.push(cell);
      };

      var node = div.datum(root).selectAll(".node")
          .data(treemap.nodes)
          .enter().append("a")
          .attr("href", function(d){ return d.href; })
          .attr("class", "node")
          .call(positionNode)
          .style("background", '#fff')
          .html(function(d) {
            if (d._percentage < 0.02) {
              return '';
            }
            return d.children ? null : '<span class="amount">' + d._area_fmt + '</span>' + d._name;
          })
          .on("mouseover", function(d) {
            d3.select(this).transition().duration(200)
              .style({'background': d3.rgb(d._color).darker() });
          })
          .on("mouseout", function(d) {
            d3.select(this).transition().duration(500)
              .style({'background': d._color});
          })
          .on("click", function(d) {
            if (typeof(state.cut) == "object") state.cut.push(state.tile + ":" + d[state.tile]);
            else if (typeof(state.cut) == "string") {
              var items = new Array();
              items.push(state.cut);
              items.push(state.tile + ":" + d[state.tile]);
              state.cut = items;
            }
            state.tile = next;
            query(model, state);
          })
          .transition()
          .duration(500)
          .delay(function(d, i) { return Math.min(i * 30, 1500); })
          .style("background", function(d) { return d._color; });

      scope.cutoffWarning = data.total_cell_count > q.pagesize;
      scope.cutoff = q.pagesize;
    };

    function positionNode() {
      this.style("left", function(d) { return d.x + "px"; })
          .style("top", function(d) { return d.y + "px"; })
          .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
          .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
    };


    var unsubscribe = babbageCtrl.subscribe(function(event, model, state) {
      query(model, state);
    });
    scope.$on('$destroy', unsubscribe);

    var defaultArea = function(model) {
      for (var i in model.aggregates) {
        var agg = model.aggregates[i];
        if (agg.measure) {
          return [agg.ref];
        }
      }
      return [];
    };

    babbageCtrl.init({
      tile: {
        label: 'Tiles',
        addLabel: 'set breakdown',
        types: ['attributes'],
        defaults: [],
        sortId: 0,
        multiple: false
      },
      area: {
        label: 'Area',
        addLabel: 'set area',
        types: ['aggregates'],
        defaults: defaultArea,
        sortId: 1,
        multiple: false
      },
    });
  }
  };
}]);
