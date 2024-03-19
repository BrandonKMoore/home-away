import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import logo from '/logoblksmall.png'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (<div className='navigation'>
    <Link to="/"><img src={logo} alt="home" id='logoImg' /></Link>
    {isLoaded && (
        <ProfileButton user={sessionUser} />
    )}
  </div>
  );
}

export default Navigation;
