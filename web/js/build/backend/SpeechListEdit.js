define(["require","exports"],(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SpeechListEdit=void 0;t.SpeechListEdit=class{constructor(e){this.$element=e,this.widget=Vue.createApp({template:'<speech-admin-widget v-bind:queue="queue" v-bind:csrf="csrf"></speech-admin-widget>',data:()=>({queue:e.data("queue"),user:e.data("user"),csrf:$("head").find("meta[name=csrf-token]").attr("content")})}),this.widget.config.compilerOptions.whitespace="condense",window.__initVueComponents(this.widget,"speech"),this.widget.mount(this.$element.find(".speechAdmin")[0])}}}));
//# sourceMappingURL=SpeechListEdit.js.map
