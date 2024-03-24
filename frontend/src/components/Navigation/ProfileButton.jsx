import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { FaCircleUser } from "react-icons/fa6";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useNavigate, Link } from 'react-router-dom';

function ProfileButton({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className='buttonDiv'>
      <button className="userMenu" onClick={toggleMenu}>
        <div className='userIcon'><FaCircleUser /></div>
        <div className='userArrow'>{showMenu ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>Hello, {user.firstName}</li>
        <li>{user.email}</li>
        <span className='border'></span>
        <li><Link to="/groups" onClick={toggleMenu}>View groups</Link></li>
        <li><Link to="/events" onClick={toggleMenu}>View events</Link></li>
        <span className='border'></span>
        <li><Link  onClick={logout}>Log Out</Link></li>
      </ul>
    </div>
  );
}

export default ProfileButton;
