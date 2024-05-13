import dbref,{userName,connectedRef} from './server/firebase'
import { useEffect } from 'react'
import { connect } from "react-redux"
import { addParticipant, removeParticipant, setUser, setUserStream } from './store/actioncreator'
import { MainScreen } from './component/MainScreen/MainScreen.Component'



function App(props) {
  const participantRef = dbref.child("participants")
  useEffect(()=>{
     navigator.mediaDevices.getUserMedia({audio:true,video:true,})
      .then((mediaStream)=>{
      // mediaStream.getVideoTracks()[0].enabled =  false;
     props.setUserStream(mediaStream)
      // console.log(mediaStream); 
    })

  connectedRef.on('value', (snap) =>{
  
    if(snap.val())
      {
        const defaultPreferences = {
          audio:true,
          video:false,
          screen:false
        }
       const userRef =   participantRef.push({
          userName,
          preferences:defaultPreferences,
        })
        props.setUser({
          [userRef.key] : {
            userName,
            ...defaultPreferences
          }
        })
        userRef.onDisconnect().remove()
      }
  })
 
  },[])
  useEffect(()=>{
   if(props.user){
    participantRef.on('child_added',(snap)=>{
      const {userName,preferences} = snap.val();
      props.addParticipant({
        [snap.key]:{
          userName,
          ...preferences,
         
          
        }
      })
    })
  
    participantRef.on("child_removed", (snap) => {
      props.removeParticipant(snap.key);
    });
  }
   
  },[props.user])
  return (
    
    <>
    <div className='App'>
      <MainScreen/>
    </div>
    </>
  )
}
const mapStateToProps = (state)=>{
  return {
  user: state.currentUser,
  participants: state.participants,

  }

}
const mapDispatchToProps = (dispatch)=>{
 return {
  setUserStream: (stream)=>dispatch(setUserStream(stream)),
  setUser: (user)=>dispatch(setUser(user)),
  addParticipant: (participant)=>dispatch(addParticipant(participant)),
  removeParticipant: (participantKey)=>dispatch(removeParticipant(participantKey))
 };
}
export default connect( mapStateToProps,mapDispatchToProps) (App);
