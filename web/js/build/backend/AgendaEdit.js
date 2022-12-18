define(["require","exports"],(function(e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0}),a.AgendaEdit=void 0;a.AgendaEdit=class{constructor(e){this.$widget=e,this.delAgendaItemStr='<a href="#" class="delAgendaItem"><span class="glyphicon glyphicon-minus-sign"></span></a>',this.$agenda=$(".motionListWithinAgenda"),this.locale=$("html").attr("lang"),this.$agenda.addClass("agendaListEditing"),this.$agenda.nestedSortable({handle:".moveHandle",items:"li.agendaItem",toleranceElement:"> div",placeholder:"movePlaceholder",tolerance:"pointer",forcePlaceholderSize:!0,helper:"clone",axis:"y",update:()=>{this.$agenda.trigger("antragsgruen:agenda-change").trigger("antragsgruen:agenda-reordered")}}),this.$agenda.on("antragsgruen:agenda-reordered",(()=>{this.saveNewOrder()})),this.$agenda.find(".agendaItem").each(((e,a)=>{this.prepareAgendaItem($(a))})),this.prepareAgendaList(this.$agenda,!0),this.$agenda.on("click",".agendaItemAdder .addEntry",this.agendaItemAdd.bind(this)),this.$agenda.on("click",".agendaItemAdder .addDate",this.agendaDateAdd.bind(this)),this.$agenda.on("change",".agendaItemAdder .showTimes input",this.showTimesChanges.bind(this)),this.$agenda.on("click",".delAgendaItem",this.delAgendaItem.bind(this)),this.$agenda.on("click",".editAgendaItem",this.editAgendaItem.bind(this)),this.$agenda.on("submit",".agendaItemEditForm",this.submitSingleItemForm.bind(this)),this.$agenda.on("submit",".agendaDateEditForm",this.submitSingleItemForm.bind(this))}buildAgendaStruct(e){let a=[];return e.children(".agendaItem").each(((e,t)=>{const n=$(t);n.find("> div > .agendaDateEditForm").length>0?a.push({type:"date",id:parseInt(n.data("id")),children:this.buildAgendaStruct(n.find("> ol"))}):a.push({type:"std",id:parseInt(n.data("id")),children:this.buildAgendaStruct(n.find("> ol"))})})),a}saveNewOrder(){const e=this.$widget.data("save-order"),a=this.buildAgendaStruct(this.$widget.find("> ol"));$.post(e,{_csrf:$("input[name=_csrf]").val(),data:JSON.stringify(a)},(e=>{e.success?this.$agenda.trigger("antragsgruen:agenda-change"):alert("Could not save: "+e.message)}))}submitSingleItemForm(e){e.preventDefault();let a=$(e.target).parents("li.agendaItem").first(),t=a.parents("li").first(),n=a.prevAll().length,d=t.length>0?t.data("id"):null,i=$(e.target),s=a.data("save-url");const r={parentId:d,position:n,title:i.find("input[name=title]").val()};if(a.hasClass("agendaItemDate")){r.type="date";const e=i.find(".dateSelector").datetimepicker("date");r.date=e?e.format("YYYY-MM-DD"):null}else r.type="agendaItem",r.inProposedProcedures=i.find("input[name=inProposedProcedures]").prop("checked"),r.hasSpeakingList=i.find("input[name=hasSpeakingList]").prop("checked"),r.motionType=parseInt(i.find("select[name=motionType]").val()),r.time=i.find("input[name=time]").val(),r.code=i.find("input[name=code]").val();$.post(s,{_csrf:$("input[name=_csrf]").val(),data:JSON.stringify(r)},(e=>{if(!e.success)return void alert("Could not save: "+e.message);const t=$(e.html);a.replaceWith(t),this.prepareAgendaItem(t),$("ol.motionListWithinAgenda").trigger("antragsgruen:agenda-change")}))}delAgendaItem(e){e.preventDefault();let a=$(e.target).parents("li.agendaItem").first(),t=a.data("del-url");bootbox.confirm(__t("admin","agendaDelEntryConfirm"),(e=>{e&&$.post(t,{_csrf:$("input[name=_csrf]").val()},(e=>{e.success?(a.remove(),$("ol.motionListWithinAgenda").trigger("antragsgruen:agenda-change")):alert("Could not delete: "+e.message)}))}))}editAgendaItem(e){e.preventDefault();let a=$(e.target).parents("li.agendaItem").first();a.addClass("editing"),a.find("> div > .agendaItemEditForm input[name=code]").trigger("focus").trigger("select")}agendaItemAdd(e){e.preventDefault();let a=$($("#agendaNewElementTemplate").val());$(e.target).parents(".agendaItemAdder").first().before(a),this.prepareAgendaItem(a),a.find(".editAgendaItem").trigger("click"),a.find(".agendaItemEditForm input.code").trigger("focus")}agendaDateAdd(e){e.preventDefault();let a=$($("#agendaNewDateTemplate").val());$(e.target).parents(".agendaItemAdder").first().before(a),this.prepareAgendaItem(a),a.find(".editAgendaItem").trigger("click")}showTimesChanges(){this.$widget.find(".agendaItemAdder .showTimes input").prop("checked")?this.$agenda.addClass("showTimes").removeClass("noShowTimes"):this.$agenda.removeClass("showTimes").addClass("noShowTimes")}prepareAgendaItem(e){e.find("> div").prepend('<span class="glyphicon glyphicon-resize-vertical moveHandle"></span>'),e.find("> div > h3").append('<a href="#" class="editAgendaItem"><span class="glyphicon glyphicon-pencil"></span></a>'),e.find("> div > h3").append(this.delAgendaItemStr),e.find("> div li.checkbox").on("click",(e=>{e.stopPropagation()})),e.find("> ol.agenda").each(((e,a)=>{this.prepareAgendaList($(a),!1)})),e.find("> div .input-group.time").datetimepicker({locale:this.locale,format:"LT"}),e.find("> div .input-group.dateSelector").each(((e,a)=>{let t=null;$(a).data("date")&&(t=moment($(a).data("date"),"YYYY-MM-DD",this.locale)),$(a).datetimepicker({locale:this.locale,format:"dddd, Do MMMM YYYY",defaultDate:t})}))}prepareAgendaList(e,a){let t='<li class="agendaItemAdder mjs-nestedSortable-no-nesting mjs-nestedSortable-disabled"><a href="#" class="addEntry"><span class="glyphicon glyphicon-plus-sign"></span> '+__t("admin","agendaAddEntry")+"</a>";a&&(t+='<a href="#" class="addDate"><span class="glyphicon glyphicon-plus-sign"></span> '+__t("admin","agendaAddDate")+'</a><span class="spacer"></span><label class="showTimes"><input type="checkbox" class="showTimes"> '+__t("admin","agendaShowTimes")+"</label>"),t+="</li>";const n=$(t);this.$agenda.hasClass("showTimes")&&n.find(".showTimes input").prop("checked",!0),e.append(n)}}}));
//# sourceMappingURL=AgendaEdit.js.map
