define(["require","exports"],function(t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var e=function(){function t(t){this.$widget=t,this.initElements(),this.initStatusSetter(),this.initCommentForm(),this.initVotingBlock(),t.submit(function(t){return t.preventDefault()})}return t.prototype.initElements=function(){this.$statusDetails=this.$widget.find(".statusDetails"),this.$visibilityInput=this.$widget.find("input[name=proposalVisible]"),this.$votingStatusInput=this.$widget.find("input[name=votingStatus]"),this.$votingBlockId=this.$widget.find("input[name=votingBlockId]"),this.context=this.$widget.data("context"),this.saveUrl=this.$widget.attr("action"),this.csrf=this.$widget.find("input[name=_csrf]").val()},t.prototype.reinitAfterReload=function(){this.initElements(),this.statusChanged(),this.commentsScrollBottom(),this.$widget.find(".newBlock").addClass("hidden"),this.$widget.find(".selectlist").selectlist()},t.prototype.saveStatus=function(){var t=this,i=this.$widget.find(".statusForm input[type=radio]:checked").val(),e={setStatus:i,visible:this.$visibilityInput.prop("checked")?1:0,votingBlockId:this.$votingBlockId.val(),_csrf:this.csrf};10==i&&(e.proposalComment=this.$widget.find("input[name=referredTo]").val()),22==i&&(e.proposalComment=this.$widget.find("input[name=obsoletedByAmendment]").val()),11==i&&(e.votingStatus=this.$votingStatusInput.filter(":checked").val()),"NEW"==e.votingBlockId&&(e.votingBlockTitle=this.$widget.find("input[name=newBlockTitle]").val()),this.$widget.find("input[name=notifyProposer]").prop("checked")&&(e.notifyProposer=!0),$.post(this.saveUrl,e,function(i){if(t.$widget.addClass("showSaved").removeClass("showSaving"),window.setTimeout(function(){return t.$widget.removeClass("showSaved")},2e3),i.success){var e=$(i.html);t.$widget.children().remove(),t.$widget.append(e.children()),t.reinitAfterReload()}else i.error?alert(i.error):alert("An error ocurred")}).fail(function(){alert("Could not save")})},t.prototype.statusChanged=function(){var t=this.$widget.find(".statusForm input[type=radio]:checked").val();this.$statusDetails.addClass("hidden"),this.$statusDetails.filter(".status_"+t).removeClass("hidden"),0==t?this.$widget.addClass("noStatus"):this.$widget.removeClass("noStatus")},t.prototype.initStatusSetter=function(){var t=this;this.$widget.on("change",".statusForm input[type=radio]",function(i,e){$(i.currentTarget).prop("checked")&&(t.statusChanged(),e&&!0===e.init||t.$widget.addClass("showSaving"))}),this.$widget.find(".statusForm input[type=radio]").trigger("change",{init:!0}),this.$widget.on("change","input",function(){t.$widget.addClass("showSaving")}),this.$widget.on("changed.fu.selectlist","#obsoletedByAmendment",function(){t.$widget.addClass("showSaving")}),this.$widget.on("click",".saving button",this.saveStatus.bind(this))},t.prototype.initVotingBlock=function(){var t=this;this.$widget.on("changed.fu.selectlist","#votingBlockId",function(){t.$widget.addClass("showSaving"),"NEW"==t.$votingBlockId.val()?t.$widget.find(".newBlock").removeClass("hidden"):t.$widget.find(".newBlock").addClass("hidden")}),this.$widget.find(".newBlock").addClass("hidden")},t.prototype.commentsScrollBottom=function(){var t=this.$widget.find(".proposalCommentForm .commentList");t[0].scrollTop=t[0].scrollHeight},t.prototype.initCommentForm=function(){var t=this;this.$widget.on("click",".proposalCommentForm button",function(){var i=t.$widget.find(".proposalCommentForm"),e=!1,n=i.find(".commentList"),s=i.find("textarea").val();""==s||e||(e=!0,$.post(t.saveUrl,{writeComment:s,_csrf:t.csrf},function(t){if(t.success){var s=$('<li><div class="header"><div class="date"></div><div class="name"></div></div><div class="comment"></div></li>');s.find(".date").text(t.comment.dateFormatted),s.find(".name").text(t.comment.username),s.find(".comment").text(t.comment.text),n.append(s),i.find("textarea").val(""),n[0].scrollTop=n[0].scrollHeight}else alert("Could not save: "+JSON.stringify(t));e=!1}).fail(function(){alert("Could not save"),e=!1}))}),this.commentsScrollBottom()},t}();i.AmendmentChangeProposal=e});
//# sourceMappingURL=AmendmentChangeProposal.js.map
