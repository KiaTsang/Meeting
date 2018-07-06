/**
 * 用于自动加载全局js的类
 * @author  ZENGQINGYUE
 * @since   2015-05-29
 * 
 */
(function($){
	$.extend({
	     includePath: '',
	     include: function(file) {
	        var files = typeof file == "string" ? [file]:file;
	        for (var i = 0; i < files.length; i++) {
	            var name = files[i].replace(/^\s|\s$/g, "");
	            var att = name.split('.');
	            var ext = att[att.length - 1].toLowerCase();
	            var isCSS = ext == "css";
	            var tag = isCSS ? "link" : "script";
	            var attr = isCSS ? " type='text/css' rel='stylesheet' " : " type='text/javascript' ";
	            var link = (isCSS ? "href" : "src") + "='" + $.includePath + name + "'";
	            if ($(tag + "[" + link + "]").length == 0) document.write("<" + tag + attr + link + "></" + tag + ">");
	        }
	   }
	});

	var _eastcompeaceUIJSRoot = '';
	/**
	 * 需要被加载的全局js和css集合(有关联关系的js文件需要按顺序添加)
	 * @property　_jsArray
	 */
	var _jsArray = [
        /********************** JS文件加载 ************************/
//        'js/libs/i18n/jquery.i18n.properties.min.js',
        // BOOTSTRAP JS
        'js/bootstrap/bootstrap2.js',
        // JARVIS WIDGETS
//        'js/smartwidgets/jarvis.widget.min.js',
        // JQUERY VALIDATE -->
        'js/plugin/jquery-validate/jquery.validate.min.js',
        'js/plugin/jquery-dragTab/jquery.resizableColumns.js',
        // browser msie issue fix
//        'js/plugin/msie-fix/jquery.mb.browser.min.js',
        // FastClick: For mobile devices
//        'js/plugin/fastclick/fastclick.js',
        // websocket support
//        'js/plugin/sockjs/sockjs.js',
//        'js/plugin/stomp/dist/stomp.js',
        'js/plugin/bootbox/bootbox.js',
        'js/plugin/jquery-pnotify/jquery.pnotify.js',
        'js/plugin/jquery-blockui/jquery.blockUI.js',
        // MAIN APP JS FILE
        'js/app.js',
//        'js/notification/SmartNotification.min.js',
        'js/core/common.js',
//        'js/core/componentConfig.js',
//        'js/resetheight.js',
        // 工具类
        'js/util/MyJsonUtil.js',
        'js/util/StringUtil.js',
        'js/util/DomUtil.js',
//        'js/util/Cookie.js',
//        'js/util/I18n.js',
        'js/core/globalInfo.js',
        'js/core/globalInfoLoader.js',
        'js/login.js'
    ];
	
	function loadAllJS(array){
		var currentDirectory = getWebRootDirectory()+'/'+_eastcompeaceUIJSRoot;
		$.includePath = currentDirectory;
		$.include(_jsArray);
	}
	/**
	 * get file's currentDirectory
	 * @return	file's currentDirectory
	 */
	function getCurrentDirectory(){
		var locHref = location.href;
		var locArray = locHref.split("/");
	    delete locArray[locArray.length-1];
	    var dirTxt = locArray.join("/");
	    return dirTxt;
	}
	/**
	 * get the web's root directory.
	 * @return
	 */
	function getWebRootDirectory(){
		var strFullPath=window.document.location.href;
		var strPath=window.document.location.pathname;
		var pos=strFullPath.indexOf(strPath);
		var prePath=strFullPath.substring(0,pos);
		var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
		return prePath+postPath;
	}

    loadAllJS(_jsArray);

})(jQuery);
