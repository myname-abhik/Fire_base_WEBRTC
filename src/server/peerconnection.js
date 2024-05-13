import dbRef from "./firebase";
const participantRef = dbRef.child("participants");
import {store} from "../main";

export const createOffer = async(peerConnection,createdId,receiverId)=>{
    const receiverRef = participantRef.child(receiverId)
 const offer =  await peerConnection.createOffer();

peerConnection.onicecandidate = event =>{
    event.candidate && 
    receiverRef.child('offercandidates').push({...event.candidate.toJSON(),
        userId: createdId
    })
}


 await  peerConnection.setLocalDescription(offer);
const offerPayload = {
    sdp: offer.sdp,
    type:offer.type,
    userId: createdId,
}
 await receiverRef.child('offers').push().set({offerPayload})
}

export const initializeListenesers = (currentUserId)=>{
    const receiverRef = participantRef.child(currentUserId)
    receiverRef.child('offers').on("child_added", async (snapshot)=>{
        const  data = snapshot.val()
        if(data?.offerPayload)
            {
               const createrId = data?.offerPayload.userId;
              const peerConnection =  store.getState().participants[createrId].peerConnection
             
               await  peerConnection.setRemoteDescription(new RTCSessionDescription(data?.offerPayload));
            //    await peerConnection.setRemoteDescription(new RTCSessionDescription(data?.offerPayload));
               createAnswer(peerConnection,currentUserId,createrId)
            
            }
    })

    
        receiverRef.child('offercandidates').on("child_added", async (snapshot)=>{
            const  data = snapshot.val()
            if(data?.userId)
                {
                //    const createrId = data?.offerPayload.userId;
                  const peerConnection =  store.getState().participants[data?.userId].peerConnection;
                  
                  peerConnection.addIceCandidate(new RTCIceCandidate(data));
    
                   await  peerConnection.setRemoteDescription(new RTCSessionDescription(data?.offerPayload));
                }
                
        })

       
            receiverRef.child('answers').on("child_added", async (snapshot)=>{
                const  data = snapshot.val()
                if(data?.answerPayload)
                    {
                       const createrId = data?.answerPayload.userId;
                      const peerConnection =  store.getState().participants[createrId].peerConnection
        
                       await  peerConnection.setRemoteDescription(new RTCSessionDescription(data?.answerPayload));
                    }
            })

            receiverRef.child('answercandidates').on("child_added", async (snapshot)=>{
                const  data = snapshot.val()
                if(data?.userId)
                    {
                    //    const createrId = data?.offerPayload.userId;
                      const peerConnection =  store.getState().participants[data?.userId].peerConnection;
                      peerConnection.addIceCandidates(new RTCIceCandidate(data));
                    }
            })


        
}


const createAnswer = async(peerConnection,currentUserId, receiverId) =>{
    const receiverRef = participantRef.child(receiverId)
    const answer =  await peerConnection.createAnswer();
   
   peerConnection.onicecandidate = event =>{
       event.candidate && 
       receiverRef.child('answerCandidates').push({...event.candidate.toJSON(),
           userId: currentUserId
       })
   }
   
   
    await  peerConnection.setLocalDescription(answer);
   const answerPayload = {
       sdp: answer.sdp,
       type:answer.type,
       userId: currentUserId,
   }
    await receiverRef.child('answers').push().set({answerPayload})
}
