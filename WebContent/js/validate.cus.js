var validator = (function() {
    return {
        _modifiedFieldCounts: {},

        _$banner: $(".banner"),

        _$cache: $("body"),

        // 为提示条中的撤销按钮绑定事件
        bindEvent: function() {
            var that = this, $cache = this._$cache;
            this._$banner.on("click", ".undo", function(e) {
                var $changedForm = $(".changed-form"),
                modifiedFieldCounts = that._modifiedFieldCounts;

                for(var k in modifiedFieldCounts) {
                    if (modifiedFieldCounts.hasOwnProperty(k)) {
                        var $input = $changedForm.find("input[data-key=" + k + "]");
                        if($input.hasClass("skiped")) {
                            $input.val("");
                        }else {
                            $input.val($cache.data("origin")[k]);
                        }
                    }
                }

                modifiedFieldCounts = null;
                modifiedFieldCounts = {};
                $(e.delegateTarget).empty();  //清空提示信息
                $cache.data("isCreated", false);
            });
        },

        /*
         * @param data the query projectDTO form ajax
         */
        validate: function(sourceData) {
            var $cache = this._$cache,
            hasProperty = false,
            $banner = this._$banner,
            that = this,
            modifiedFieldCounts = this._modifiedFieldCounts;

            if (sourceData) {
                $cache.data({"origin": sourceData, "isCreated": false});  //cache the data

                $(".changed-form").find("input").addClass("changed").end().on("keyup", ".changed", function(e) {
                    var $current = $(this);  //for this case, it 's input element'
                    var dataProperty = $current.data("key");
                    var currentVal = $current.val();
                    if(sourceData[dataProperty] == currentVal) {
                        delete modifiedFieldCounts[dataProperty];
                    }else{
                        modifiedFieldCounts[dataProperty] = currentVal;
                    }

                    hasProperty = false;

                    if (Object.keys(modifiedFieldCounts).length) {
                        hasProperty = true;
                    }

                    if (hasProperty) {
                        if(!$banner.html().length) {
                            $banner.html('<div class="alert alert-warning" style="position: relative;">' + '<i class="fa fa-check-circle-o"></i> 您修改了项目的相关字段，这将会创建一个新的项目。' + '<div class="pull-right" style="position: absolute; right: 22px; top: 3px;">' + '<a class="btn btn-primary undo"><i class="fa fa-undo"></i> 撤销</a>' + '</div>' + '</div>');
                            $cache.data("isCreated", hasProperty);
                        }
                    }else {
                        that.removeBanner();
                        $cache.data("isCreated", hasProperty);
                    }
                });
            }else {
                this.cleanValidation();
            }

            this.removeBanner();
        },

        validationResult: function() {
            return this._$cache.data("isCreated");
        },

        cleanValidation: function() {
            $(".changed-form").find("input").removeClass("changed");
            this._$cache.removeData();
        },

        removeBanner: function() {
            this._$banner.empty();
        }
    };
}());
