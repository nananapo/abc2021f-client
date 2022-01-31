import { GetSessionInfoAsync } from "../store.js";
import { UserInfo } from "./UserInfo.js";

const SessionInfo = Vue.component('SessionInfo', {
    template: '#session-info',
    props: {
        sessionId: String,
    },
    components: {
        UserInfo
    },
    data() {
        return {
            isValidSession: false,
            sessionName: "",
            ownerId: "",
            description: "",
            createdAt: "",
            startAt: "",
            endAt: "",
            status: "",
        }
    },
    methods: {
        refresh: async function () {

            if (this.sessionId === null || this.sessionId.length === 0) {
                this.sessionName = "セッションIDが不正です";
                return;
            }

            let data = await GetSessionInfoAsync(this.sessionId);

            if (data == null) {
                this.sessionName = "セッション情報の取得に失敗しました";
                this.isValidSession = false;
                return;
            }

            this.sessionName = data.name;
            this.ownerId = data.ownerId;
            this.description = data.description;
            this.createdAt = data.createdAt;
            this.startAt = data.startTime;
            this.endAt = data.endTime;
            this.status = data.status;
            this.isValidSession = true;

            this.$emit("updated");
        }
    },
    watch: {
        sessionId: function (newVal, oldVal) {
            this.refresh();
        }
    },
});

export { SessionInfo };