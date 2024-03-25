import OpenModalButton from "../OpenModalButton"
import SignupFormModal from "../SignupFormModal"
import { useSelector } from "react-redux/es/hooks/useSelector";
import lpvideochat from "/lpvideochat.jpg"
import { Link } from "react-router-dom"
import eventPic from '/event-pic.jpg'
import groupPic from '/group-pic.jpg'
import sagPic from '/sag-pic.jpg'
import "./LandingPage.css"

export default function LandingPage () {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="small-page-container" id="landing-page">
      <div id="top">
        <div id="headerText">
          <h1>The people platform where interests become friendships</h1>
          <p>Good friends are hard to come by... says no one that uses SocialEyes. This platform is made for people who like to explore together because everything is better with friends. So welcome to SocialEyes, where we make a good time... Better!!! </p>
        </div>
        <img src={lpvideochat} alt="" />
      </div>
      <div id='mid'>
        <h3>How SocialEyes works</h3>
        <p>SocialEyes help bring people with similar interest together.</p>
      </div>
      <div id='bottom'>
        <div className="navOptions group">
          <img src={groupPic} alt="" />
          <Link to="groups"><h3>See all groups</h3></Link>
          <p>Check out our groups page where we include all groups so you can connect with people.</p>
        </div>
        <div className="navOptions event">
          <img src={eventPic} alt="" />
          <Link to='events'><h3>Find an event</h3></Link>
          <p>Events is what it&apos;s all about. Come join in on the fun by finding an event near you</p>
        </div>
        <div className="navOptions newGroup">
          <img src={sagPic} alt="" />
          {sessionUser ? <Link to='groups/new'><h3>Start a new group</h3></Link> : <Link className="disabled"><h3>Start a new group</h3></Link>}
          <p>Ready to be an organizer of a new group. Click start a new group to get started.</p>
        </div>
      </div>
      {sessionUser ? null : <OpenModalButton buttonText="Join SocialEyes" modalComponent={<SignupFormModal />} />}
    </div>
  )
}
