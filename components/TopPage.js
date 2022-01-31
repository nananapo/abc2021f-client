import { CreateSessionCard } from "./CreateSessionCard.js";
import { JoinSessionCard } from "./JoinSessionCard.js";
import { WatchHistoryCard } from "./WatchHistoryCard.js";

const TopPage = Vue.component('TopPage', {
    template: "#toppage",
    components: {
        CreateSessionCard,
        JoinSessionCard,
        WatchHistoryCard
    },
    methods: {
        logout: async function () {
            if (!await SignoutAsync()) {
                this.statusText = error;
            }
        }
    }
});

export { TopPage };