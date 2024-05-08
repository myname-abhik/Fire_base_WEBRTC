import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
 apiKey :'AIzaSyBY9gwcKMN3JtPOQ4Ign6S5jEj5amYN3-o',
 databaseURL:'https://video-95dcd-default-rtdb.asia-southeast1.firebasedatabase.app/',
}
firebase.initializeApp(firebaseConfig)

let  dbRef = firebase.database().ref();
export const connectedRef = firebase.database().ref(".info/connected");
export const userName = prompt("what's your username")

const urlparams = new URLSearchParams(window.location.search);
const roomid = urlparams.get("id");
if(roomid){
dbRef =dbRef.child(roomid)
}
else
{
    dbRef =dbRef.push();
    window.history.replaceState(null,"meet","?id="+dbRef.key)
}

export default dbRef;
