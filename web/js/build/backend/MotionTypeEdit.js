define(["require","exports","../shared/AntragsgruenEditor"],function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});new(function(){function e(){$(".deleteTypeOpener button").on("click",function(){$(".deleteTypeForm").removeClass("hidden"),$(".deleteTypeOpener").addClass("hidden")}),$('[data-toggle="tooltip"]').tooltip(),this.initCreateExplanation(),this.initSectionList(),this.initDeadlines(),this.initInitiatorForm($("#motionSupportersForm")),this.initInitiatorForm($("#amendmentSupportersForm"));var e=$("#sameInitiatorSettingsForAmendments input");e.on("change",function(){e.prop("checked")?$("section.amendmentSupporters").addClass("hidden"):$("section.amendmentSupporters").removeClass("hidden")}).trigger("change")}return e.prototype.initCreateExplanation=function(){var n=!1,i=$("#typeHasCreateExplanation");i.on("change",function(){var e=$("#typeCreateExplanationHolder");if(i.prop("checked")){if(e.removeClass("hidden"),!n){n=!0;var t=e.find(".texteditor"),a=new r.AntragsgruenEditor(t.attr("id")).getEditor();t.parents("form").on("submit",function(){t.parent().find("textarea").val(a.getData())})}}else e.addClass("hidden")}).trigger("change")},e.prototype.initInitiatorForm=function(a){var t=this,n=a.find(".contactGender input"),i=a.find(".supportType"),r=a.find(".formGroupAllowMore input");r.on("change",function(){var e=parseInt(i.find("input").val(),10);2!==e&&1!==e||!r.is(":checked")?a.find(".formGroupAllowAfterPub").addClass("hidden"):a.find(".formGroupAllowAfterPub").removeClass("hidden")}).trigger("change"),i.on("changed.fu.selectlist",function(){var e=i.find("input").val();i.find('li[data-value="'+e+'"]').data("has-supporters")?(a.find(".formGroupMinSupporters").removeClass("hidden"),a.find(".formGroupAllowMore").removeClass("hidden"),t.motionsHaveSupporters=!0):(a.find(".formGroupMinSupporters").addClass("hidden"),a.find(".formGroupAllowMore").addClass("hidden"),t.motionsHaveSupporters=!1),n.trigger("change"),r.trigger("change"),t.setMaxPdfSupporters()}).trigger("changed.fu.selectlist");var e=a.find("input[name=initiatorCanBePerson]"),d=a.find("input[name=initiatorCanBeOrganization]");e.on("change",function(){e.prop("checked")?a.find(".formGroupGender").removeClass("hidden"):(a.find(".formGroupGender").addClass("hidden"),d.prop("checked")||d.prop("checked",!0).trigger("change"))}),d.on("change",function(){d.prop("checked")?a.find(".formGroupResolutionDate").removeClass("hidden"):(a.find(".formGroupResolutionDate").addClass("hidden"),e.prop("checked")||e.prop("checked",!0).trigger("change"))}),n.on("change",function(){var e=parseInt(n.filter(":checked").val(),10),t=parseInt(i.find("input").val(),10);0!==e&&2===t?a.find(".formGroupMinFemale").removeClass("hidden"):a.find(".formGroupMinFemale").addClass("hidden")}).trigger("change")},e.prototype.setMaxPdfSupporters=function(){this.amendmentsHaveSupporters||this.motionsHaveSupporters?$("#typeMaxPdfSupportersRow").removeClass("hidden"):$("#typeMaxPdfSupportersRow").addClass("hidden")},e.prototype.initDeadlines=function(){$("#deadlineFormTypeComplex").on("change",function(e){$(e.currentTarget).prop("checked")?($(".deadlineTypeSimple").addClass("hidden"),$(".deadlineTypeComplex").removeClass("hidden")):($(".deadlineTypeSimple").removeClass("hidden"),$(".deadlineTypeComplex").addClass("hidden"))}).trigger("change"),$(".datetimepicker").each(function(e,t){var a=$(t);a.datetimepicker({locale:a.find("input").data("locale")})});var i=function(e){var a=e.find(".datetimepickerFrom"),n=e.find(".datetimepickerTo");a.datetimepicker({locale:a.find("input").data("locale")}),n.datetimepicker({locale:n.find("input").data("locale"),useCurrent:!1});var t=function(){!function(){var e=a.data("DateTimePicker").date(),t=n.data("DateTimePicker").date();return e&&t&&t.isBefore(e)}()?(a.removeClass("has-error"),n.removeClass("has-error")):(a.addClass("has-error"),n.addClass("has-error"))};a.on("dp.change",t),n.on("dp.change",t)};$(".deadlineEntry").each(function(e,t){i($(t))}),$(".deadlineHolder").each(function(e,t){var a=$(t),n=function(){var e=$(".deadlineRowTemplate").html();e=e.replace(/TEMPLATE/g,a.data("type"));var t=$(e);a.find(".deadlineList").append(t),i(t)};a.find(".deadlineAdder").on("click",n),a.on("click",".delRow",function(e){$(e.currentTarget).parents(".deadlineEntry").remove()}),0===a.find(".deadlineList").children().length&&n()})},e.prototype.initSectionList=function(){var i=$("#sectionsList"),r=0;i.data("sortable",Sortable.create(i[0],{handle:".drag-handle",animation:150})),i.on("click","a.remover",function(e){e.preventDefault();var t=$(this).parents("li").first(),a=t.data("id");bootbox.confirm(__t("admin","deleteMotionSectionConfirm"),function(e){e&&($(".adminTypeForm").append('<input type="hidden" name="sectionsTodelete[]" value="'+a+'">'),t.remove())})}),i.on("change",".sectionType",function(){var e=$(this).parents("li").first(),t=parseInt($(this).val());e.removeClass("title textHtml textSimple image tabularData pdfAlternative pdfAttachment videoEmbed"),0===t?e.addClass("title"):1===t?e.addClass("textSimple"):2===t?e.addClass("textHtml"):3===t?e.addClass("image"):4===t?(e.addClass("tabularData"),0==e.find(".tabularDataRow ul > li").length&&e.find(".tabularDataRow .addRow").trigger("click").trigger("click").trigger("click")):5===t?e.addClass("pdfAttachment"):6===t?e.addClass("pdfAlternative"):7===t&&e.addClass("videoEmbed")}),i.find(".sectionType").trigger("change"),i.on("change",".maxLenSet",function(){var e=$(this).parents("li").first();$(this).prop("checked")?e.addClass("maxLenSet").removeClass("no-maxLenSet"):e.addClass("no-maxLenSet").removeClass("maxLenSet")}),i.find(".maxLenSet").trigger("change"),$(".sectionAdder").on("click",function(e){e.preventDefault();var t=$("#sectionTemplate").html();t=t.replace(/#NEW#/g,"new"+r);var a=$(t);i.append(a),r+=1,i.find(".sectionType").trigger("change"),i.find(".maxLenSet").trigger("change");var n=a.find(".tabularDataRow ul");n.data("sortable",Sortable.create(n[0],{handle:".drag-data-handle",animation:150}))});var d=0;i.on("click",".tabularDataRow .addRow",function(e){e.preventDefault();var t=$(this),a=t.parent().find("ul"),n=$(t.data("template").replace(/#NEWDATA#/g,"new"+d));d+=1,n.removeClass("no0").addClass("no"+a.children().length),a.append(n),n.find("input").trigger("focus")}),i.on("click",".tabularDataRow .delRow",function(e){var t=$(this);e.preventDefault(),bootbox.confirm(__t("admin","deleteDataConfirm"),function(e){e&&t.parents("li").first().remove()})}),i.find(".tabularDataRow ul").each(function(){$(this).data("sortable",Sortable.create(this,{handle:".drag-data-handle",animation:150}))})},e}())});
//# sourceMappingURL=MotionTypeEdit.js.map
