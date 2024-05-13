import { createOffer,initializeListenesers } from "../server/peerconnection";
import { SET_USER,ADD_PARTICIPANT,REMOVE_PARTICIPANT, SET_USERSTREAM } from "./actiontypes"

let initialstate = {
    currentUser:null,
    participants:{},
    mainStream: null,

}
const stunServers = {
    iceServers: [{
        urls: [
            "stun:global.stun.twilio.com:3478",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
            "stun:stun.services.mozilla.com",
    ]
    } ]
}   

export const reducer = (state = initialstate,action)=>{
    switch(action.type){
        case SET_USERSTREAM:{
            let {payload} = action;
            state ={...state, ...payload}
            return state;
        }
        case SET_USER:{
            let {payload} = action;
            state ={...state,currentUser: {...payload.currentUser}};
            initializeListenesers(Object.keys(payload.currentUser)[0])
            return state;
        }
        case ADD_PARTICIPANT:{
            let {payload} = action;
            const currentUserId = Object.keys(state.currentUser)[0]
            const participantId = Object.keys(payload.participant)[0]
            if(currentUserId === participantId) {
                payload.participant[participantId].currentUser = true
            }
            if((state.mainStream) && (!payload.participant[participantId].currentUser)) {
                addConnecion(state.currentUser,payload.participant,state.mainStream)
            }
            payload.participant[participantId].avatarColor = `#${Math.floor(Math.random()*16777215).toString(16)}`
            let participants = {...state.participants,...payload.participant};
            state ={...state,participants}
            return state;
        }
        case REMOVE_PARTICIPANT:{
            let {payload} = action;
            let participants = {...state.participants}
            delete participants[payload.participantsKey]
            state ={...state,participants}
            return state;
        }
        default:
            {
                return state;
            }
    }
}

const addConnecion = (currentUser,newUser,mediaStream)=>{
    const peerConnection = new RTCPeerConnection(stunServers);
    mediaStream.getTracks().forEach((track)=>{
        peerConnection.addTrack(track,mediaStream)
    })
   const  currentUserKey = Object.keys(currentUser)[0];
   const  newUserKey = Object.keys(newUser)[0];
   const sortedIDs = [currentUserKey, newUserKey].sort((a,b)=>
 a.localeCompare(b)
);

newUser[newUserKey].peerConnection = peerConnection
if(sortedIDs[1] === currentUserKey ){
   createOffer(peerConnection,sortedIDs[1],sortedIDs[0] )
}

}