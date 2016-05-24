define([
  "pentaho/visual/base/View",
  "pentaho/data/filter"
], function(BaseView, filter) {
  "use strict";

  return BaseView.extend({
    /** @override */
    _render: function() {
      var dataTable = this.model.getv("data");

      var R = dataTable.getNumberOfRows();
      var C = dataTable.getNumberOfColumns();

      var table = document.createElement("table");

      var tableHeader = this.model.getv("tableHeader");
      if(tableHeader) {
        var caption = document.createElement("caption");
        caption.innerHTML = tableHeader;

        table.appendChild(caption);
      }

      var showBorder = this.model.getv("showBorder");
      if(showBorder) {
        table.style.borderWidth = "0.2rem";
        table.style.borderStyle = "solid";
      }

      var tbody = document.createElement("tbody");

      var header_row = document.createElement("tr");

      for(var j = 0; j !== C; ++j) {
        var cj = dataTable.getColumnLabel(j);

        var header_cell = document.createElement("th");
        header_cell.innerHTML = cj;

        header_row.appendChild(header_cell);
      }

      tbody.appendChild(header_row);

      var viz = this;

      for(var i = 0; i !== R; ++i) {
        var row = document.createElement("tr");

        for(var j = 0; j !== C; ++j) {
          var vij = dataTable.getFormattedValue(i, j);

          var cell = document.createElement("td");
          cell.innerHTML = vij;

          row.appendChild(cell);
        }

        tbody.appendChild(row);
      }

      table.appendChild(tbody);

      this._element.innerHTML = "";
      this._element.appendChild(table);
    }
  });
});
