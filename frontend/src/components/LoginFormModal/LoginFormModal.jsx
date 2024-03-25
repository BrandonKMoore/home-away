import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';
import { Link } from 'react-router-dom'

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabledSubmitBtn, setDisabledSubmitBtn] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();

      if (data && data.message) {
        setErrors(data.message);
      }
    });
  };

  useEffect(()=>{
    credential.length >= 4 && password.length >= 6 ? setDisabledSubmitBtn(false) : setDisabledSubmitBtn(true)
  }, [credential.length, password.length])


  const signInDemo = () =>{
    return dispatch(sessionActions.login({ credential: "d.user24", password: "DemolitionMan24!" }))
    .then(closeModal)
  }

  return (
    <>
      <h1>Log In</h1>
      {Object.values(errors).length ? <span>The provided credentials were invalid</span> : null}
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit" disabled={disabledSubmitBtn}>Log In</button>
      </form>
      <Link className='demoButton' onClick={signInDemo}>Log in as Demo User</Link>
    </>
  );
}

export default LoginFormModal;
