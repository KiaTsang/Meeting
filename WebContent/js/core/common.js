var common = function() {

  return {
		_const: {
			imgUrl: {
				critical: '<img class="imgAlignment" src="' + $.url_root + '/img/critical.png' + '" style="margin-left: 0px;"></img><a title="%s" class="without-decoration font-default">%s</a>',
				minor: '<span class="fa fa-arrow-down txt-color-yellow" style="margin-left: 1px;"></span>&nbsp;<a title="%s" class="without-decoration font-default">%s</a>',
				major: '<span class="fa fa-arrow-up txt-color-red" style="margin-left: 1px;"></span>&nbsp;<a title="%s" class="without-decoration font-default">%s</a>',
				trivial: '<span class="fa fa-arrow-down txt-color-green" style="margin-left: 1px;"></span>&nbsp;<a title="%s" class="without-decoration font-default">%s</a>'
			}
		},

		getImgUrl: function(key) {
			if (!key) {
				return "";
			}

			return this._const.imgUrl[key.toLowerCase()].replace(/%s/g, arguments[1]);
		},
		//datatable plugin
		loadDatatableSettings: function() {
			$.extend($.fn.dataTable.defaults, {
				"sPaginationType" : "bootstrap_full",
				"pageLength": 10,
				"paging": true,
			    "searching": false,
			    "ordering": false,
			    "stateSave": false,
			    "language": {
		    		"processing": "正在处理",
		    		"lengthMenu": "每页显示 _MENU_ 条记录",
		    		"zeroRecords": "对不起，查询不到相关数据！",
		    		"info": "当前显示 _START_ 到 _END_ 条，总共 _TOTAL_ 条记录",
		    		"infoEmpty": "没有符合指定条件的数据",
		    		"emptyTable": "没有符合指定条件的数据",
		    		"infoFiltered": "该页 _MAX_ 条记录",
		    		"paginate": {
		    			"first":    "首页",
		    			"previous": "上一页",
		    			"next":     "下一页",
		    			"last":     "末页"
			    		}
			    	}
			});
		},

	    formatDate: function(key) {
	    	var cellvalue = $.trim(new String(key));

			if(cellvalue != "" && cellvalue != null)
			{
				re = /T/g;
				cellvalue = cellvalue.replace(re, "&nbsp").substring(0,10);
			}
			else
				return '<div>-</div>';

			return cellvalue;
	    },
	    formatDateTime: function(key) {
	    	var cellvalue = $.trim(new String(key));

			if(cellvalue != "" && cellvalue != null)
			{
				re = /T/g;
				cellvalue = cellvalue.replace(re, "&nbsp");
			}
			else
				return '<div>-</div>';

			return cellvalue;
	    },

	    splitStr: function(str) {
	    	return str.split(",");
	    },

		/**
		 * placeholderConversion
		 *
	     * param string msg: The {0} sample {1} string {2}...
		 * param array args: (["id","name"])
		 */
		placeholderConversion : function(options)
		{
			if(options.args == undefined || options.args.length == 0)
			{
				  return options.msg;
			}else
			{
				for(var s=options.msg, i=0; i<options.args.length; i++)
					s=s.replace(new RegExp("\\{"+i+"\\}","g"), options.args[i]);
			    return s;
			}
		},
		initSelectLange : function(lang)
		{
			"use strict";
		    $.fn.select2.locales = {};
		    $.fn.select2.locales[lang] = {
		        formatNoMatches: function () { return "没有找到匹配项"; },
		        formatInputTooShort: function (input, min) { var n = min - input.length; return "请至少输入" + n + "个字符";},
		        formatInputTooLong: function (input, max) { var n = input.length - max; return "请删掉" + n + "个字符";},
		        formatSelectionTooBig: function (limit) { return "你只能选择最多" + limit + "项"; },
		        formatLoadMore: function (pageNumber) { return "加载结果中…"; },
		        formatSearching: function () { return "搜索中…"; }
		    };

		    $.extend($.fn.select2.defaults, $.fn.select2.locales[lang]);
		}
	  };
}();

