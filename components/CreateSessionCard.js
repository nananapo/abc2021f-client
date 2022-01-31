import { nowTime,createUUID } from "../utils.js";
import {createSession} from "../store.js";


const CreateSessionCard = Vue.component('CreateSessionCard', {
    template: '#create-session-card',
    data() {
        return {
            sessionName: "",
            description: "",
            startTime: "",
            endTime: "",
            isProcessing: false,
        }
    },
    methods: {
        async createSession() {
            if (this.isProcessing) return;
            this.isProcessing = true;

            let uuid = createUUID();
            if (await createSession(uuid, this.sessionName.length > 0 ? this.sessionName : "新しいセッション", this.description, this.startTime, this.endTime)) {
                this.$router.push({
                    name: "Session",
                    params: { sessionId: uuid }
                });
            } else {
                alert("セッションの作成に失敗しました" + e);
            }
            this.isProcessing = false;
        },
        nowTime() {
            return nowTime();
        }
    },
    mounted() {
        // now time string  
        this.startTime = nowTime();
        this.endTime = nowTime();
    }
});

export { CreateSessionCard };