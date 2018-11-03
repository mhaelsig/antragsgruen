define(["require","exports"],function(t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var e=function(){function t(t){this.$widget=t,this.savingComment=!1,this.initElements(),this.initOpener(),this.initStatusSetter(),this.initCommentForm(),this.initVotingBlock(),this.initExplanation(),t.submit(function(t){return t.preventDefault()})}return t.prototype.initElements=function(){this.$statusDetails=this.$widget.find(".statusDetails"),this.$visibilityInput=this.$widget.find("input[name=proposalVisible]"),this.$votingStatusInput=this.$widget.find("input[name=votingStatus]"),this.$votingBlockId=this.$widget.find("input[name=votingBlockId]"),this.$openerBtn=$(".proposedChangesOpener button"),this.context=this.$widget.data("context"),this.saveUrl=this.$widget.attr("action"),this.csrf=this.$widget.find("input[name=_csrf]").val()},t.prototype.initOpener=function(){var t=this;this.$openerBtn.click(function(){t.$widget.removeClass("hidden"),t.$openerBtn.addClass("hidden"),localStorage.setItem("proposed_procedure_enabled","1")}),this.$widget.on("click",".closeBtn",function(){t.$widget.addClass("hidden"),t.$openerBtn.removeClass("hidden"),localStorage.setItem("proposed_procedure_enabled","0")}),"1"===localStorage.getItem("proposed_procedure_enabled")?(this.$widget.removeClass("hidden"),this.$openerBtn.addClass("hidden")):this.$widget.addClass("hidden")},t.prototype.reinitAfterReload=function(){this.initElements(),this.statusChanged(),this.commentsScrollBottom(),this.initExplanation(),this.$widget.find(".newBlock").addClass("hidden"),this.$widget.find(".selectlist").selectlist(),this.$widget.find(".notifyProposerSection").addClass("hidden")},t.prototype.setGlobalProposedStr=function(t){$(".motionData .proposedStatusRow .str").html(t)},t.prototype.performCallWithReload=function(t){var e=this;t._csrf=this.csrf,$.post(this.saveUrl,t,function(t){if(t.success){var i=$(t.html);e.$widget.children().remove(),e.$widget.append(i.children()),e.reinitAfterReload(),e.$widget.addClass("showSaved").removeClass("isChanged"),t.proposalStr&&e.setGlobalProposedStr(t.proposalStr),window.setTimeout(function(){return e.$widget.removeClass("showSaved")},2e3)}else t.error?alert(t.error):alert("An error occurred")}).fail(function(){alert("Could not save")})},t.prototype.notifyProposer=function(){var t=this.$widget.find("textarea[name=proposalNotificationText]").val(),i=this.$widget.find("input[name=proposalNotificationFrom]").val(),e=this.$widget.find("input[name=proposalNotificationReply]").val();this.performCallWithReload({notifyProposer:"1",text:t,fromName:i,replyTo:e})},t.prototype.saveStatus=function(){var t=this.$widget.find(".statusForm input[type=radio]:checked").val(),i={setStatus:t,visible:this.$visibilityInput.prop("checked")?1:0,votingBlockId:this.$votingBlockId.val()};10==t&&(i.proposalComment=this.$widget.find("input[name=referredTo]").val()),22==t&&(i.proposalComment=this.$widget.find("input[name=obsoletedByAmendment]").val()),23==t&&(i.proposalComment=this.$widget.find("input[name=statusCustomStr]").val()),11==t&&(i.votingStatus=this.$votingStatusInput.filter(":checked").val()),"NEW"==i.votingBlockId&&(i.votingBlockTitle=this.$widget.find("input[name=newBlockTitle]").val()),this.$widget.find("input[name=setPublicExplanation]").prop("checked")&&(i.proposalExplanation=this.$widget.find("textarea[name=proposalExplanation]").val()),this.performCallWithReload(i)},t.prototype.statusChanged=function(){var t=this.$widget.find(".statusForm input[type=radio]:checked").val();this.$statusDetails.addClass("hidden"),this.$statusDetails.filter(".status_"+t).removeClass("hidden"),0==t?this.$widget.addClass("noStatus"):this.$widget.removeClass("noStatus")},t.prototype.initStatusSetter=function(){var e=this;this.$widget.on("change",".statusForm input[type=radio]",function(t,i){$(t.currentTarget).prop("checked")&&(e.statusChanged(),i&&!0===i.init||e.$widget.addClass("isChanged"))}),this.$widget.find(".statusForm input[type=radio]").trigger("change",{init:!0}),this.$widget.on("change keyup","input, textarea",function(t){0<$(t.currentTarget).parents(".proposalCommentForm").length||e.$widget.addClass("isChanged")}),this.$widget.on("changed.fu.selectlist","#obsoletedByAmendment",function(){e.$widget.addClass("isChanged")}),this.$widget.on("click",".saving button",this.saveStatus.bind(this)),this.$widget.on("click",".notifyProposer",function(){e.$widget.find(".notifyProposerSection").removeClass("hidden")}),this.$widget.on("click","button[name=notificationSubmit]",this.notifyProposer.bind(this))},t.prototype.initVotingBlock=function(){var t=this;this.$widget.on("changed.fu.selectlist","#votingBlockId",function(){t.$widget.addClass("isChanged"),"NEW"==t.$votingBlockId.val()?t.$widget.find(".newBlock").removeClass("hidden"):t.$widget.find(".newBlock").addClass("hidden")}),this.$widget.find(".newBlock").addClass("hidden")},t.prototype.initExplanation=function(){var i=this;this.$widget.find("input[name=setPublicExplanation]").change(function(t){$(t.target).prop("checked")?i.$widget.find("section.publicExplanation").removeClass("hidden"):i.$widget.find("section.publicExplanation").addClass("hidden")}),this.$widget.find("input[name=setPublicExplanation]").prop("checked")?this.$widget.find("section.publicExplanation").removeClass("hidden"):this.$widget.find("section.publicExplanation").addClass("hidden")},t.prototype.commentsScrollBottom=function(){var t=this.$widget.find(".proposalCommentForm .commentList");t[0].scrollTop=t[0].scrollHeight},t.prototype.doSaveComment=function(){var n=this,o=this.$widget.find(".proposalCommentForm"),s=o.find(".commentList"),t=o.find("textarea").val();""==t||this.savingComment||(this.savingComment=!0,$.post(this.saveUrl,{writeComment:t,_csrf:this.csrf},function(t){if(t.success){var i="";t.comment.delLink&&(i='<button type="button" data-url="'+t.comment.delLink+'" class="btn-link delComment">',i+='<span class="glyphicon glyphicon-trash"></span></button>');var e=$('<li class="comment"><div class="header"><div class="date"></div>'+i+'<div class="name"></div></div><div class="comment"></div></li>');e.find(".date").text(t.comment.dateFormatted),e.find(".name").text(t.comment.username),e.find(".comment").text(t.comment.text),e.data("id",t.comment.id),s.append(e),o.find("textarea").val(""),s[0].scrollTop=s[0].scrollHeight}else alert("Could not save: "+JSON.stringify(t));n.savingComment=!1}).fail(function(){alert("Could not save"),n.savingComment=!1}))},t.prototype.delComment=function(i){$.post(i.find(".delComment").data("url"),{_csrf:this.csrf,id:i.data("id")},function(t){t.success?i.remove():alert("Error: "+t.error)})},t.prototype.initCommentForm=function(){var i=this;this.$widget.on("click",".proposalCommentForm button",function(){i.doSaveComment()}),this.commentsScrollBottom(),this.$widget.on("keypress",".proposalCommentForm textarea",function(t){t.originalEvent.metaKey&&13===t.originalEvent.keyCode&&i.doSaveComment()}),this.$widget.on("click",".delComment",function(t){i.delComment($(t.currentTarget).parents(".comment").first())})},t}();i.ChangeProposedProcedure=e});
//# sourceMappingURL=ChangeProposedProcedure.js.map
