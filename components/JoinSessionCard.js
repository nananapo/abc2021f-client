const JoinSessionCard = Vue.component("JoinSessionCard", {
    template: '#join-session-card',
    data() {
        return {
            sessionId: "",
        }
    },
    methods: {
        joinSession: function () {
            this.sessionId = this.sessionId.replace(/\s/g, "");
            this.sessionId = this.sessionId.replace("Session:", "");
            this.$router.push({
                name: "Session",
                params: { sessionId: this.sessionId }
            });
        },
    }
});

export { JoinSessionCard };