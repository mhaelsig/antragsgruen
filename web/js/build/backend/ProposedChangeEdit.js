define(["require","exports","../shared/AntragsgruenEditor","../frontend/MotionMergeAmendments"],(function(t,e,i,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.ProposedChangeEdit=void 0;class o{constructor(t){this.$form=t,this.hasChanged=!1,this.textEditCalled(),this.initCollisionDetection(),t.on("submit",(()=>{$(window).off("beforeunload",o.onLeavePage)}))}textEditCalled(){$(".wysiwyg-textarea:not(#sectionHolderEditorial)").each(((t,e)=>{let n=$(e).find(".texteditor"),o=new i.AntragsgruenEditor(n.attr("id")).getEditor();n.parents("form").on("submit",(()=>{n.parent().find("textarea.raw").val(o.getData()),void 0!==o.plugins.lite&&(o.plugins.lite.findPlugin(o).acceptAll(),n.parent().find("textarea.consolidated").val(o.getData()))})),$("#"+n.attr("id")).on("keypress",this.onContentChanged.bind(this))})),this.$form.find(".resetText").on("click",(t=>{let e=$(t.currentTarget).parents(".wysiwyg-textarea").find(".texteditor");window.CKEDITOR.instances[e.attr("id")].setData(e.data("original-html")),$(t.currentTarget).parents(".modifiedActions").addClass("hidden")}))}initCollisionDetection(){if(!this.$form.data("collision-check-url"))return;this.$collisionIndicator=this.$form.find("#collisionIndicator");let t=null;window.setInterval((()=>{let e=this.getTextConsolidatedSections();if(JSON.stringify(e)===t)return;t=JSON.stringify(e);let i=this.$form.data("collision-check-url");$.post(i,{_csrf:this.$form.find("> input[name=_csrf]").val(),sections:e},(t=>{if(t.error)this.$collisionIndicator.removeClass("hidden"),this.$collisionIndicator.find(".collisionList").html("<li>"+t.error+"</li>");else if(0==t.collisions.length)this.$collisionIndicator.addClass("hidden");else{this.$collisionIndicator.removeClass("hidden");let e="";t.collisions.forEach((t=>{e+=t.html})),this.$collisionIndicator.find(".collisionList").html(e)}}))}),5e3)}getTextConsolidatedSections(){let t={};return $(".proposedVersion .wysiwyg-textarea:not(#sectionHolderEditorial)").each(((e,i)=>{let o=$(i),s=o.find(".texteditor"),a=o.parents(".proposedVersion").data("section-id"),r=s.clone(!1);r.find(".ice-ins").each(((t,e)=>{n.MotionMergeChangeActions.insertAccept(e)})),r.find(".ice-del").each(((t,e)=>{n.MotionMergeChangeActions.deleteAccept(e)})),t[a]=r.html()})),t}static onLeavePage(){return __t("std","leave_changed_page")}onContentChanged(){this.hasChanged||(this.hasChanged=!0,$("body").hasClass("testing")||$(window).on("beforeunload",o.onLeavePage))}}e.ProposedChangeEdit=o}));
//# sourceMappingURL=ProposedChangeEdit.js.map
