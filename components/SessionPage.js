import { createChart } from "../utils.js";
import { SessionInfo } from "./SessionInfo.js";
import { getSessionHistory, getUserId , getUserNameAsync} from "../store.js";
import { getIdTokenAsync } from "../store.js";

const SERVER_ADDRESS = "wss://oekaki.chat:3030"


// socket通信
function connectServer(component, sessionId, asHost) {

    console.log("connectServer");

    Vue.set(component, "statusText", "接続中...");
    Vue.set(component, "isConnected", true);

    let socket = io(SERVER_ADDRESS, { secure: true });

    let disconnect = function () {
        if (socket != null) {
            socket.disconnect();
            socket = null;
        }
        Vue.set(component, "isConnected", false);
    }

    let sendDataTimer = -1;

    socket.on('connect', async () => {
        console.log("connected");
        Vue.set(component, "statusText", "認証中...");

        let token = await getIdTokenAsync();
        if (token === null) {
            disconnect();
        }

        socket.emit("login", token);
    });

    socket.on('disconnect', () => {
        console.log("disconnected")
        Vue.set(component, "statusText", "切断されました");
        Vue.set(component, "isConnected", false);
        Vue.set(component, "disconnectFunc", null);

        if (!asHost && sendDataTimer != -1) {
            clearInterval(sendDataTimer);
            sendDataTimer = -1;
            stopSensing();
        }

        setTimeout(() => {
            component.$refs.sessionInfo.refresh();
        }, 3000)
    });

    socket.on("login", result => {
        Vue.set(component, "statusText", "入室中...");
        socket.emit("join", sessionId);
    });

    socket.on("join", result => {

        if (asHost) {
            Vue.set(component, "statusText", "セッションを開始しました");
            Vue.set(component, "isWaiting", false);
            Vue.set(component, "isStarted", true);
            component.$refs.sessionInfo.refresh();
        }

        if (!asHost) {
            Vue.set(component, "statusText", "入室しました");
            startSensing();

            sendDataTimer = setInterval(() => {

                let labelList = getLabels();

                if (labelList.length == 0) return;

                let smartphoneCount = 0;
                for (let i = 0; i < labelList.length; i++) {
                    if (labelList[i] == "watchsmartphone") {
                        smartphoneCount++;
                    }
                }

                let result = smartphoneCount / labelList.length;
                socket.emit("watch-data", result);
            }, 300);
        }
    });

    if (asHost) {
        socket.on("realtime-data", data => {
            let time = data.time;
            let packedData = data.data;
            component.addPackedData(time, packedData);
        });
    }

    socket.on("error", (err) => {
        console.log(err);
    });

    Vue.set(component, "disconnectFunc", disconnect);
}

const SessionPage = Vue.component('Session', {
    template: '#session',
    components: {
        SessionInfo,
    },
    data() {
        return {
            sessionId: "",
            statusText: "未接続",
            isWaiting: false,
            isStarted: false,
            isEnded: false,
            isOwner: false,

            isPlayingHistory: false,
            playIndex: 0,
            historyData: {},
            timeNow: "",


            isConnected: false,
            connectStatusText: "",
            users: [],
            disconnectFunc: null,

            packedDataSet: [],

            chart1: null
        }
    },
    methods: {
        startSession: async function () {
            if (!this.isWaiting || this.isConnected) return;
            connectServer(this, this.sessionId, true);
        },
        endSession: async function () {
            if (!this.isStarted || !this.isConnected) return;
            this.isStarted = false;
            this.disconnectFunc();
        },
        sessionInfoUpdated: async function () {

            let info = this.$refs.sessionInfo;
            this.isWaiting = info.status === "waiting";
            this.isStarted = info.status === "started";
            this.isEnded = info.status === "ended";
            this.isOwner = info.ownerId === getUserId();

            this.isPlayingHistory = false;
            this.playIndex = 0;
            this.historyData = {};

            this.packedDataSet = [];


            if(this.isEnded){

                let history = await getSessionHistory(this.sessionId);
                if(history == null){
                    alert("セッションの履歴を取得できませんでした");
                    return;
                }

                this.playIndex = 0;
                this.historyData = history;
                this.isPlayingHistory = false;
            }
        },
        historyPlayLoop: function () {

            if(!this.isPlayingHistory){
                return;
            }

            let times = Object.keys(this.historyData);
            let time = times[this.playIndex];
            let data = this.historyData[time];

            if(data == null || data == undefined){
                this.isPlayingHistory = false;
                this.playIndex = 0;
                this.packedDataSet = [];
                return;
            }

            this.addPackedData(time, data);

            this.playIndex++;
            if (this.playIndex >= this.historyData.length) {
                this.isPlayingHistory = false;
                this.playIndex = 0;
                this.packedDataSet = [];
                return;
            }

            let nextTime = times[this.playIndex];
            setTimeout(()=>this.historyPlayLoop(), Date.parse(nextTime) - Date.parse(time));
        },
        joinSession: function () {
            if (!this.isStarted || this.isConnected) return;
            connectServer(this, this.sessionId, false);
        },
        addPackedData: function (time, data) {

            this.timeNow = time;

            this.packedDataSet.push({
                time: time,
                data: data
            });
            if (this.packedDataSet.length > 60) {
                this.packedDataSet.shift();
            }
            this.refreshChart();
        },
        refreshChart:async  function () {

            let scroll = window.scrollY;

            if (this.chart1 !== null) {
                this.chart1.destroy();
            }

            let labels = [];
            let data = {
                all: {
                    name:"平均",
                    color: '255, 99, 132, 1',
                    width: 3,
                    data: []
                }
            };
            let timeCount = 0;
            for (let objectIndex in this.packedDataSet) {
                labels.push(timeCount);

                let obj = this.packedDataSet[objectIndex];
                let sum = 0;
                for (let uid in obj.data) {
                    let name = await getUserNameAsync(uid);
                    if (!(uid in data)) {
                        data[uid] = {
                            name:name,
                            color: '255,0,0,1',
                            data: [],
                            width: 1
                        };
                        for (let i = 0; i < timeCount; i++) {
                            data[uid].data.push(0);
                        }
                    }

                    let v = 1 - obj.data[uid];
                    data[uid].data.push(v);
                    sum += v;
                }

                data["all"].data.push(sum / Object.keys(obj.data).length);

                //TODO 途中で抜けたデータを0で補完するべき
                timeCount++;
            }

            this.chart1 = createChart(this.$refs.chart1, "関心度 : " + this.packedDataSet[this.packedDataSet.length-1].time, labels, data);

            window.scrollTo(0, scroll);
        }
    },
    mounted() {
        this.sessionId = this.$route.params.sessionId;
        if (this.sessionId == null || this.sessionId.length == 0) {
            this.statusText = "セッションIDが不正です";
            return;
        }
    },
    beforeRouteUpdate(to, from, next) {
        if (this.disconnectFunc != null) {
            this.disconnectFunc();
        }
        this.sessionId = to.params.sessionId;
        next();
    },
    beforeRouteLeave(to, from, next) {
        if (this.disconnectFunc != null) {
            this.disconnectFunc();
        }
        next();
    },
    watch: {
        isPlayingHistory: function(newVal, oldVal){
            if(newVal){
                setTimeout(()=>this.historyPlayLoop(), 1);
            }
        }
    }
});

export { SessionPage };