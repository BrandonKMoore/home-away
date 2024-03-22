import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import logo from '/logoblksmall.png'


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ?
    (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    ) : (
      <>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
      </>
    );


  return (
  <div className='navigation'>
    <Link to="/"><img src={logo} alt="home" id='logoImg' /></Link>
    <div className='right'>
      {sessionUser ? <Link className='link' to='/groups/new'>Start a new group</Link> : null}
      <ul>
        <li>
        </li>
        {isLoaded && sessionLinks}
      </ul>
    </div>
  </div>
  );
}

export default Navigation;
