import React, { useState, useRef } from 'react';
import './App.css';
import raisely from './rlogo.svg';
import eye from './eyeShow.png';
import eyeHide from './eyeHide.png'
import axios from 'axios'

var call;
function App() {

  const lastNameRef = useRef(null);
  const eMailRef = useRef(null);
  const passwordRef = useRef(null);
  const submitRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passValid, setPassValid] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [loading,setLoading] = useState(false)
  const [failure,setFailure] = useState('')

  const keyPress = (e, refs) => {
    if (e.key === 'Enter') {
      if (refs) {
        refs.current.focus()
        return
      }
      signUp()
      console.log('submit')
    }
  }

  const signUp = () => {
    setLoading(true)
    axios.post('https://api.raisely.com/v3/signup', {
      campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
      data: { 
          email,
          firstName, 
          lastName,
          password
        }
    })
    .then(res => {
      setLoading(false)
      window.location = 'https://admin.raisely.com/login'
    })
    .catch(e => {
      setLoading(false)
      console.log('---->', e.response.data.errors[0].message)
      setFailure(e.response.data.errors[0].message)
    })
  }

  const emailExists = (email) => {

    axios.post('https://api.raisely.com/v3/check-user', {
      campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
      data: { email }
    })
      .then(res => {
        if (res.data.data.status === 'EXISTS') {
          setEmailExist(true)
        } else {
          setEmailExist(false)
        }
      })
      .catch(err => {
        console.log('---->', err)
      })

  }

  const changeValue = (e) => {
    setFailure('')
    if (e.target.id === 'firstname') {
      setFirstName(e.target.value)
    }
    if (e.target.id === 'lastname') {
      setLastName(e.target.value)
    }
    if (e.target.id === 'email') {
      let val = e.target.value
      let re = /\S+@\S+\.\S+/;
      let result = re.test(e.target.value);
      if (result) {
        clearTimeout(call);
        call = setTimeout(() => {
          emailExists(val)
        }, 200);
      }
      setEmailValid(result)
      setEmail(e.target.value)
    }
    if (e.target.id === 'password') {
      var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      let result = strongRegex.test(e.target.value);
      setPassValid(result)
      setPassword(e.target.value)
    }
  }

  const eyeToggle = () => {
    setShow(!show)
    passwordRef.current.focus();
  }

  const submit = (e) => {
    e.preventDefault();
  }

  const enable = () => {
    return firstName.length && lastName.length && email.length && password.length && emailValid && passValid && !emailExist && !loading
  }

  return (
    <div className="App flex flex-center align-center">
      <div>
        <div className='logo'>
          <a href="https://www.raisely.com/" target="_blank"> <img src={raisely} alt="raisely-logo" /></a>
        </div>

        <form onSubmit={submit} className="App-form">

          <div className="flex flex-column">
            <label className="roboto-family" for="firstname">First Name</label>
            <input onKeyPress={(e) => { keyPress(e, lastNameRef) }} type="text" id="firstname" placeholder="John" autoFocus maxLength="40" value={firstName} onChange={changeValue} />
          </div>

          <div className="flex flex-column">
            <label className="roboto-family" for="lastname">Last Name</label>
            <input ref={lastNameRef} onKeyPress={(e) => { keyPress(e, eMailRef) }} type="text" id="lastname" placeholder="Doe" maxLength="40" value={lastName} onChange={changeValue} />
          </div>

          <div className="flex flex-column">
            <div className="flex flex-between"><label className="roboto-family" for="email">E-Mail</label><p className='error-text'>{(!emailValid || emailExist) && email.length ? emailExist ? 'E-Mail exists' : 'E-Mail invalid' : null}</p></div>
            <input ref={eMailRef} onKeyPress={(e) => { keyPress(e, passwordRef) }} type="text" id="email" className={(!emailValid || emailExist) && email.length ? 'invalidInput' : ''} placeholder="johndoe@domain.com" maxLength="80" value={email} onChange={changeValue} />
          </div>

          <div className="flex flex-column">
            <div className="flex flex-between"><label className="roboto-family" for="password">Password&nbsp;</label><span className='flex flex-between'><p className='error-text'>{!passValid && password.length ? 'Password invalid, check placeholder for required inputs and minimum characters' : null}</p><img onClick={eyeToggle} className='eyes' src={show ? eyeHide : eye} alt="eye-icon" /></span></div>
            <input ref={passwordRef} onKeyPress={(e) => { keyPress(e, submitRef) }} type={show ? "text" : "password"} id="password" className={!passValid && password.length ? 'invalidInput' : ''} placeholder="ex - aA#@34ab /minlength-8/special ch-1/uppercase-1/lowercase-1/number-1" maxLength="20" value={password} onChange={changeValue} />
          </div>
          <p className={`error-text ${failure.length?' visible':' hidden'}`}>{failure.length?failure:'.'}</p>

          <div className="flex flex-end">
            <button ref={submitRef} onClick={signUp} onKeyPress={keyPress} type="submit" className="submit-btn roboto-family" disabled={!enable() ? true : false}>{loading?'to Login...':'Sign Up'}</button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default App;
