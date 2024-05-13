import  react from 'react';
import { MeetingFooter } from '../Meetingfooter/MeetingFooter.Component';
import "./MainScreen.css"
import { Participants } from '../Participants/Participants.Component';
export  const MainScreen = ()=>{
return(<div className='wrapper'>
   <div className='mainScreen'><Participants/></div>
   <div className='footer'>
    <MeetingFooter/>
   </div>
</div>)
}

