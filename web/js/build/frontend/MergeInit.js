define(["require","exports"],function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e){this.$widget=e,this.$checkboxes=this.$widget.find(".toMergeAmendments .selectSingle"),this.$allCheckbox=this.$widget.find(".selectAll"),this.initExportBtn(),this.initAllCheckbox()}return e.prototype.recalcExportBtn=function(){var i=[];this.$checkboxes.filter(":checked").each(function(e,t){i.push(parseInt(t.getAttribute("name").split("[")[1]))});var e=this.exportLinkTpl.replace(/IDS/,i.join(","));this.$widget.find(".exportHolder a").attr("href",e)},e.prototype.initExportBtn=function(){var e=this;this.exportLinkTpl=this.$widget.find(".exportHolder a").attr("href"),this.$widget.on("change",".toMergeAmendments input[type=checkbox]",function(){e.recalcExportBtn()}),this.recalcExportBtn()},e.prototype.recalcAllCheckbox=function(){var i=!0,c=!0;this.$checkboxes.each(function(e,t){$(t).prop("checked")?c=!1:i=!1}),c?this.$allCheckbox.prop("checked",!1).prop("indeterminate",!1):i?this.$allCheckbox.prop("checked",!0).prop("indeterminate",!1):this.$allCheckbox.prop("indeterminate",!0)},e.prototype.initAllCheckbox=function(){var e=this;this.recalcAllCheckbox(),this.$allCheckbox.change(function(){e.$checkboxes.prop("checked",e.$allCheckbox.prop("checked"))}),this.$checkboxes.change(function(){e.recalcAllCheckbox()})},e}();t.MergeInit=i});
//# sourceMappingURL=MergeInit.js.map
