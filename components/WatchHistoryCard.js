
const WatchHistoryCard = Vue.component("WatchHistoryCard", {
    template: '#watch-history-card',
    data() {
        return {
            sessionId: "",
        }
    },
    methods: {
        openHistory: function () {
            this.sessionId = this.sessionId.replace(/\s/g, "");
            this.sessionId = this.sessionId.replace("Session:", "");
            this.$router.push({
                name: "Session",
                params: { sessionId: this.sessionId }
            });
        },
    }
});

export { WatchHistoryCard };