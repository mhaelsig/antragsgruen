define(["require","exports"],(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CurrentSpeechList=void 0;t.CurrentSpeechList=class{constructor(e){this.$element=e;const t=this.$element.find(".currentSpeechList"),i={queue:e.data("queue"),user:e.data("user"),csrf:$("head").find("meta[name=csrf-token]").attr("content"),title:e.data("title"),adminUrl:e.data("admin-url")};e.hasClass("currentSpeechFullPage")?this.widget=Vue.createApp({template:'\n                    <speech-user-full-list-widget :initQueue="queue" :user="user" :csrf="csrf" :title="title"></speech-user-full-list-widget>',data:()=>i}):e.hasClass("currentSpeechInline")?this.widget=Vue.createApp({template:'\n                    <speech-user-inline-widget :initQueue="queue" :user="user" :csrf="csrf" :title="title"></speech-user-inline-widget>',data:()=>i}):this.widget=Vue.createApp({template:'\n                    <speech-user-footer-widget :initQueue="queue" :user="user" :csrf="csrf" :title="title" :adminUrl="adminUrl"></speech-user-footer-widget>',data:()=>i}),this.widget.config.compilerOptions.whitespace="condense",window.__initVueComponents(this.widget,"speech"),this.widget.mount(t[0])}}}));
//# sourceMappingURL=CurrentSpeechList.js.map
