/*
* Copyright 2002 - 2016 Webdetails, a Pentaho company. All rights reserved.
*
* This software was developed by Webdetails and is provided under the terms
* of the Mozilla Public License, Version 2.0, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/

define(
  [
    "pentaho/type/Context",
    "pentaho/data/Table",
    "pentaho/type/configurationService",
    "scripts/viz-demo/model",
    "scripts/dataManager"
  ],
  function(Context, Table, configurationService, myModelFactory, dataManager) {

    "use strict";

    // the where
    var context = new Context();

    // the how
    var MyModel = context.get(myModelFactory);

    var output = document.getElementById("output");

    //b5ccc6d0-ba5c-425e-9ce4-950c73340f5e
    dataManager.getData('3872a957-6702-4fff-8902-52ed8264906b', function(res){


      // the what
      var myData = new Table({
        model: [
          {name: "family", type: "string", label: "Family"},
          {name: "sales", type: "number", label: "Sales"}
        ],
        rows: [
          {c: [{v: "plains", f: "Plains"}, 123]},
          {c: [{v: "cars", f: "Cars"}, {v: 456}]}
        ]
      });

      //init(new Table(res.responseText));
      init(myData);
    });

    function init(data) {

      var model = new MyModel(
        {
          width: 200,
          height: 200,

          showBorder: true,

          data: data
        }
      );

      model.type.viewClass.then(function(MyView) {
        var view = new MyView(output, model);

        view.render();
      });
    }
  });
