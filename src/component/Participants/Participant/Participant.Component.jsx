import React, { useEffect ,useRef} from "react";
import './Participant.css'
import {Card} from "../../Shared/Card/Card.Component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
export const Participant = ({Participant})=>{
      const videoRef = useRef(null);
      const userStream  =  useSelector((state)=> state.mainStream)
      const remoteStream = new MediaStream();
      
      useEffect(()=>{
            if(Participant.peerConnection){
                  Participant.peerConnection.ontrack = (event)=>{
                        event.streams[0].getTracks().forEach((track) =>{
                              remoteStream.addTrack(track)
                        })
                        videoRef.current.srcObject = remoteStream;
                  }
            }
            
      
      },[Participant.peerConnection,videoRef,remoteStream])

      useEffect(()=>{
            if(userStream && Participant.currentUser){
                  videoRef.current.srcObject = userStream 
                  
                 
            }
        
      },[Participant.currentUser,userStream,videoRef])
 return (
  <div className="participant">
   <Card>
        <video ref={videoRef} className="video" autoPlay playsInline></video>
        <FontAwesomeIcon className="muted" icon={faMicrophoneSlash}/>
        <div style={{background : Participant.avatarColor}} className="avatar">{Participant.userName[0]}</div>
        <div className="name">{Participant.userName} {Participant.currentUser ?  "(YOU)" : ""}</div>
        </Card>
    
  </div>
 )
 
}