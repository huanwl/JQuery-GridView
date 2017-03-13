(function($){

  var GridView = function(div, options)
  {

    var Model = {
      init: function(){
        var json = JSON.stringify(options.data);
        var html = '<textarea class="json" style="display:none">' + json + '</textarea>';
        $(div).append(html);
      },
      getIndexById: function(models, id){
        for (var i in models) {
          var model = models[i];
          if (model["KeyID"] == id) {
            return i;
          }
        }
        return -1;
      },
      getJsonData: function(div){
        var data = $(div).find('textarea.json').html();
        if (data != undefined && data != null && data != '') {
          return JSON.parse(data);
        }
        return [];
      },
      setJsonData: function(div, models){
        var json = JSON.stringify(models);
        $(div).find('textarea.json').html(json);
      },
      getNewKeyID: function(){
        var dt = new Date();
        var hr = this.pad(dt.getHours().toString());
        var mn = this.pad(dt.getMinutes().toString());
        var sc = this.pad(dt.getSeconds().toString());
        return hr + mn + sc;
      },
      pad: function(n){
        return (n < 10) ? ("0" + n) : n;
      },
      isExist: function(models, key){
        for (var i in models){
          var m = models[i];
          if (m.KeyID == key){
            return true;
          }
        }
        return false;
      }
    };

    Model.init();

    var Table = {
      init: function(data){
        var html = "";
        // 畫出表頭
        html += this.drawHeadRow(options.heads);
        // 畫出資料列
        for (var i in data){
          html += this.drawDataRow(options.heads, data[i]);
        }
        // 包覆 table 標籤
        html = this.wrapTable(html);
        $(div).append(html);
      },
      drawInputRow: function(heads, model, isNoWrap){
        var row_html = "<td><button class='btn btn-primary grid-save'>儲存</button><button class='btn btn-warning grid-cancel'>取消</button><td>";
        heads.forEach(function(head, index){
          var type = head.type;
          var control = "";
          switch (type) {
            case "text":
              control = "<textarea class='" + head.name + "'></textarea>";
              if (model != undefined) {
                control = "<textarea class='" + head.name + "'>" + model[head.name] + "</textarea>";
              }
              break;
            case "radio":
              var rs = Math.random().toString();
              for (var key in head.options) {
                var temp = "";
                if (model != undefined && key == model[head.name]){
                  temp += "<input type='radio' name='" + rs + "' class='" + head.name + "' value='" + key + "' checked/> ";
                }
                else {
                  temp += "<input type='radio' name='" + rs + "' class='" + head.name + "' value='" + key + "'/> ";
                }
                control += "<label>" + temp + head.options[key] + "</label>"
              }
              break;
            case "checkbox":
              for (var key in head.options) {
                var temp = "";
                if (model != undefined){
                  var checks = model[head.name];
                  if (checks.indexOf(key) != -1){
                    temp += "<input type='checkbox' class='" + head.name + "' value='" + key + "' checked/> ";
                  }
                  else{
                    temp += "<input type='checkbox' class='" + head.name + "' value='" + key + "'/> ";
                  }
                }
                else {
                  temp += "<input type='checkbox' class='" + head.name + "' value='" + key + "'/> ";
                }
                control += "<label>" + temp + head.options[key] + "</label>"
              }
              break;
            case "select":
              for (var key in head.options) {
                if (model != undefined && key == model[head.name]){
                  control += "<option value='" + key + "' selected> " + head.options[key] + "</option>";
                }
                else {
                  control += "<option value='" + key + "'> " + head.options[key] + "</option>";
                }
              }
              control = "<select class='" + head.name + "'>" + control + "</select>";
              break;
            default:
              control = "control is undefined";
          }
          row_html += "<td>" + control + "</td>"
        });

        if (isNoWrap == true) {
          return row_html;
        }
        return this.wrapRow(row_html, "-" + Model.getNewKeyID());
      },
      drawDataRow: function(heads, item, isNoWrap){
        var row_html = "<td><button class='btn btn-primary grid-edit'>編輯</button><button class='btn btn-danger grid-delete'>刪除</button><td>";
        heads.forEach(function(head){
          var key = head.name;
          if (head.options == undefined){
            row_html += "<td>" + item[key] + "</td>";
          }
          else if (head.type == "checkbox"){
            var option_keys = item[key];
            var t = "";
            for (var i in option_keys){
              var k = option_keys[i];
              t += head.options[k] + ",";
            }
            t = t.slice(0, t.length - 1);
            row_html += "<td>" + t + "</td>";
          }
          else {
            var option_key = item[key];
            row_html += "<td>" + head.options[option_key] + "</td>";
          }
        });

        if (isNoWrap == true) {
          return row_html;
        }
        return this.wrapRow(row_html, item["KeyID"]);
      },
      drawHeadRow: function(heads){
        var head_html = "<th width='15%'><button class='btn btn-primary grid-create'>新增</button><th>";
        heads.forEach(function(elem){
          var th = "<th>" + elem.text + "</th>";
          head_html += th;
        });
        return this.wrapRow(head_html, "");
      },
      wrapRow: function(html, KeyID){
        return "<tr KeyID=" + KeyID + ">" + html + "</tr>";
      },
      wrapTable: function(html){
        return "<table class='table' style='margin:0'>" + html +"</table>";
      }
    };

    Table.init(options.data);

    var Pager = {
      init: function(){
        var html = "";
        var btn_prev = "<a>上一頁</a>";
        var btn_next = "<a>下一頁</a>";
        var select = "<select></select>";

        html2 = "Page size: <select><option>10</option><option>20</option></select>";
        html2 = this.wrapDiv(html2, "pull-left");
        $(div).append(html2);

        html2 = "View 1-10 of 23";
        html2 = this.wrapDiv(html2, "pull-right");
        $(div).append(html2);

        html = btn_prev + " " + select + " " + btn_next;
        html = this.wrapDiv(html, "text-center");
        $(div).append(html);


      },
      wrapDiv: function(html, className){
        return "<div class='" + className + "'>" + html + "</div>";
      }
    };

    Pager.init();

    var Events = {
      init: function(){
        var table = $(div).find('table');
        $(table).on('click', 'button.grid-create', function() {
          return Events.create(table);
        });
        $(table).on('click', 'button.grid-edit', function() {
          var row = $(this).closest('tr');
          return Events.edit(row, div);
        });
        $(table).on('click', 'button.grid-save', function() {
          var row = $(this).closest('tr');
          return Events.save(row, div);
        });
        $(table).on('click', 'button.grid-cancel', function() {
          var row = $(this).closest('tr');
          return Events.cancel(row, div);
        });
        $(table).on('click', 'button.grid-delete', function() {
          var row = $(this).closest('tr');
          return Events.delete(row, div);
        });
      },
      create: function(table){
        var html = Table.drawInputRow(options.heads);
        $(table).append(html);
      },
      edit: function(row, div){
        var models = Model.getJsonData(div);
        var id = $(row).attr('KeyID');
        var index = Model.getIndexById(models, id);
        $(row).empty();
        var html = Table.drawInputRow(options.heads, models[index], true);
        $(row).html(html);
      },
      save: function(row, div){
        var models = Model.getJsonData(div);
        var id = $(row).attr('KeyID');
        var index = Model.getIndexById(models, id);
        var newModel = { KeyID:id };
        options.heads.forEach(function(head, index){
          var type = head.type;
          var name = head.name;
          var control = "";
          switch (type) {
            case "text":
              newModel[name] = $(row).find("textarea." + name).val();
              break;
            case "radio":
              newModel[name] = $(row).find('input.' + name + ':checked').val();
              break;
            case "checkbox":
              var arr = [];
              $(row).find('input.' + name + ':checked').each(function(index, elem){
                arr.push($(elem).val());
              });
              newModel[name] = arr;
              break;
            case "select":
              newModel[name] = $(row).find('select.' + name + ' option:selected').val();
              break;
            default:
              control = "control is undefined";
          }
        });

        if (Model.isExist(models, id) == false) {
          // 儲存新增資料
          models.push(newModel);
        }
        else {
          // 儲存修改的資料
          models[index] = newModel;
        }

        Model.setJsonData(div, models);

        $(row).empty();
        var html = Table.drawDataRow(options.heads, newModel, true);
        $(row).html(html);
      },
      cancel: function(row, div){
        var models = Model.getJsonData(div);
        var id = $(row).attr('KeyID');
        if (Model.isExist(models, id) == false) {
          $(row).remove();
        }
        else {
          var index = Model.getIndexById(models, id);
          $(row).empty();
          var html = Table.drawDataRow(options.heads, models[index], true);
          $(row).html(html);
        }
      },
      delete: function(row, div){
        if (confirm("是否刪除？")) {
          var models = Model.getJsonData(div);
          var id = $(row).attr('KeyID');
          var index = Model.getIndexById(models, id);
          models.splice(index, 1);
          Model.setJsonData(div, models);
          $(row).remove();
        }
        else {
          return false;
        }
      }
    };

    Events.init();

  };

  $.fn.extend({
    DrawGrid: function(options){
      return this.each(function(){
        var view = new GridView(this, options);
      });
    }
  });
})(jQuery);
