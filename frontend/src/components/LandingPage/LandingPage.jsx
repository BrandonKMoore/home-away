import OpenModalButton from "../OpenModalButton"
import SignupFormModal from "../SignupFormModal"
import { useSelector } from "react-redux/es/hooks/useSelector";
import lpvideochat from "/lpvideochat.jpg"
import { Link } from "react-router-dom"
import placeHolderImage from '/favicon.ico'
import "./LandingPage.css"

export default function LandingPage () {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="page-container" id="landing-page">
      <div id="top">
        <div id="headerText">
          <h1>The people platform where interests become friendships</h1>
          <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
        </div>
        <img src={lpvideochat} alt="" />
      </div>
      <div id='mid'>
        <h2>How Meetup works</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
      </div>
      <div id='bottom'>
        <div className="navOptions group">
          <img src={placeHolderImage} alt="" />
          <Link><h3>See all groups</h3></Link>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
        </div>
        <div className="navOptions event">
          <img src={placeHolderImage} alt="" />
          <Link><h3>Find an event</h3></Link>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
        </div>
        <div className="navOptions newGroup">
          <img src={placeHolderImage} alt="" />
          <Link><h3>Start a new group</h3></Link>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
        </div>
      </div>
      {sessionUser ? null : <OpenModalButton buttonText="Join Meetup" modalComponent={<SignupFormModal />} />}
    </div>
  )
}
