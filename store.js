import {nowTime} from './utils.js';

// initialize firebase
const firebaseConfig = {
    apiKey: "AIzaSyDpFxwnIZVX92VqFJh1OGQreHb_mR5_OW8",
    authDomain: "a2021o.firebaseapp.com",
    databaseURL: "https://a2021o-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "a2021o",
    storageBucket: "a2021o.appspot.com",
    messagingSenderId: "566058073613",
    appId: "1:566058073613:web:1673c8094593afac6ddf44"
};
firebase.initializeApp(firebaseConfig);

let auth = firebase.auth();
let db = firebase.firestore();

async function getUserNameAsync(userId) {
    try {
        let snapshot = await db.collection("users").doc(userId).get();
        if (!snapshot.exists) {
            return "User not found";
        }
        return snapshot.data().name;
    } catch (e) {
        console.log(e);
        return "Failed to get user name";
    }

}

async function SetNameAsync(name) {
    try{
        await db.collection('users').doc(getUserId()).set({
            name: this.name,
        });
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
}

async function getIdTokenAsync(userId) {
    try {
        return await auth.currentUser.getIdToken();
    } catch (e) {
        console.log(e);
        return null;
    }
}

function getUserId() {
    if (auth.currentUser != null) {
        return auth.currentUser.uid;
    } else {
        return null;
    }
} ``

async function SignoutAsync() {
    try {
        await auth.signOut();
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
async function SignupAsync() {
    try {
        await auth.signInAnonymously();
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function GetSessionInfoAsync(sessionId) {
    try {
        let doc = await db.collection("sessions").doc(sessionId).get();

        if (!doc.exists) {
            return null;
        }
        let data = doc.data();
        return data;
    } catch (e) {
        console.error(e);
        return null;
    }

}

async function createSession(sessionId, name, description, startTime, endTime) {
    try {
        await db.collection("sessions").doc(sessionId).set({
            name: name,
            description: description,
            ownerId: getUserId(),
            createdAt: nowTime(),
            startTime: startTime,
            endTime: endTime,
            status: "waiting",
        });
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

Vue.use(Vuex)

let store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment(state) {
            console.log("inc")
            state.count++
        }
    }
});

export { store, auth, getUserNameAsync, getIdTokenAsync, getUserId, SignoutAsync, SignupAsync, SetNameAsync, GetSessionInfoAsync, createSession }