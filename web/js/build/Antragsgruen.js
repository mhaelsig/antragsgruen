!function(s){var t=s("#antragsgruenScript"),e=requirejs.config({baseUrl:t.data("resource-base")+"js/build/"});s("[data-antragsgruen-load-class]").each(function(){var t=s(this).data("antragsgruen-load-class");e([t])}),s("[data-antragsgruen-widget]").each(function(){var a=s(this),n=a.data("antragsgruen-widget");e([n],function(t){var e=n.split("/");new t[e[e.length-1]](a)})}),s(".jsProtectionHint").each(function(){var t=s(this);s('<input type="hidden" name="jsprotection">').attr("value",t.data("value")).appendTo(t.parent()),t.remove()}),bootbox.setLocale(s("html").attr("lang").split("_")[0]),s(document).on("click",".amendmentAjaxTooltip",function(t){var n=s(t.currentTarget);if("0"==n.data("initialized")){n.data("initialized","1");var e="popover popover-amendment-ajax "+n.data("tooltip-extra-class"),a="right";n.data("placement")&&(a=n.data("placement")),n.popover({html:!0,trigger:"manual",container:"body",template:'<div class="'+e+'" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',placement:a,content:function(){var e="pop_"+(new Date).getTime(),t='<div id="'+e+'">Loading...</div>',a=n.data("url");return s.get(a,function(t){s("#"+e).html(t)}),t}})}s(".amendmentAjaxTooltip").not(n).popover("hide"),s(".ajaxAmendment").parents(".popover").remove(),n.popover("toggle")}),s(document).on("click",function(t){var e=s(t.target);e.hasClass("amendmentAjaxTooltip")||e.hasClass("popover")||0!=e.parents(".amendmentAjaxTooltip").length||0!=e.parents(".popover").length||(s(".amendmentAjaxTooltip").popover("hide"),s(".ajaxAmendment").parents(".popover").remove())});var c=function(t){var l="0.";t.find("> li.agendaItem").each(function(){var t=s(this),e=t.data("code"),a="",n=t.find("> ol");if("#"==e){var o=l.split(".");if(o[0].match(/^[a-y]$/i))o[0]=String.fromCharCode(o[0].charCodeAt(0)+1);else{var i=o[0].match(/^(.*[^0-9])?([0-9]*)$/),r=void 0===i[1]?"":i[1],d=parseInt(""==i[2]?"1":i[2]);o[0]=r+ ++d}l=a=o.join(".")}else a=l=e+"";t.find("> div > h3 .code").text(a),0<n.length&&c(n)})};s("ol.motionListWithinAgenda").on("antragsgruen:agenda-change",function(){c(s(this))}).trigger("antragsgruen:agenda-change"),s(".motionList .amendmentsToggler").each(function(t,e){var a=s(e);a.find("button").on("click",function(){a.toggleClass("closed"),a.toggleClass("opened"),a.next("ul.amendments").toggleClass("closed")})}),window.__t=function(t,e){return"undefined"==typeof ANTRAGSGRUEN_STRINGS?"@TRANSLATION STRINGS NOT LOADED":void 0===ANTRAGSGRUEN_STRINGS[t]?"@UNKNOWN CATEGORY: "+t:void 0===ANTRAGSGRUEN_STRINGS[t][e]?"@UNKNOWN STRING: "+t+" / "+e:ANTRAGSGRUEN_STRINGS[t][e]}}(jQuery);
//# sourceMappingURL=Antragsgruen.js.map
