define([
  "pentaho/visual/base/model"
], function(baseModelFactory) {
  "use strict";

  return function(context) {
    var BaseModel = context.get(baseModelFactory);

    return BaseModel.extend({
      type: {
        id: "scripts/viz-demo",
        view: "view",
        props: [
          {
            name: "showBorder",
            type: "boolean"
          },
          {
            name: "tableHeader",
            isRequired: true,
            value: "The default header"
          }
        ]
      }
    });
  };
});
