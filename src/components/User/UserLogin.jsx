import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link, Navigate } from 'react-router-dom'
import { auth, db } from '../../firebase.config'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [redirect, setRedirect] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    let validity = true

    if (email === '') {
      validity = false
      setErrEmail('*Please enter your Email ID')
    }

    if (typeof (email) !== 'undefined') {
      let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i)
      if (!pattern.test(email)) {
        validity = false
        setErrEmail('*Please enter valid Email ID')
      }
    }

    if (password === '') {
      validity = false
      setErrPassword('*Please enter your Password')
    }

    if (typeof (password) !== 'undefined') {
      if (!(password.length > 6)) {
        validity = false
        setErrPassword('*Please enter more than 6 characters')
      }
    }

    return validity
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      const userRef = doc(db,"user",email)
      const userSnap = await getDoc(userRef)
      const userData = userSnap.data()
      console.log("user",userSnap)
      signInWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
          console.log(res)
          localStorage.setItem("email", res.user.email)
          const shgData = await getDocs(collection(db , "shg"));
          // shgData.forEach(e=>{
          //   if(e.shg_name === res.user.)
          // })
          // localStorage.setItem("shgAadhar", res.user.email)

          localStorage.removeItem("isAdmin")

          if(userData?.isMember===true) {
            alert('Logged in Successfully!')
            navigate('/shg-list')
          }
          else {
            alert('Logged in Successfully!')
            setRedirect(true)

          }
        })
        .catch(err => alert(err))
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='Login'>
      <div className="container">
        <form method='post'
          className="form"
          name='Login-Form'
          onSubmit={(e) => handleSubmit(e)}
        >
          <h2>Login</h2>

          <div className="control">
            <label htmlFor="email">Email</label>
            <input type="text"
              name='email'
              onChange={e => setEmail(e.target.value)}
              placeholder='Enter Email'
            />
            <small className="errorMsg">{errEmail}</small>
          </div>

          <div className="control">
            <label htmlFor="password">Password</label>
            <input type="password"
              name='password'
              onChange={e => setPassword(e.target.value)}
              placeholder='Enter Password'
            />
            <small className="errorMsg">{errPassword}</small>
          </div>

          <div className="control">
            <span>Don't have an account? <Link to='/user-signup' className='login-link-1'>Signup</Link></span>
          </div>

          <input type='submit' className='button' value='Login' />
        </form>
        {redirect === true ? <Navigate to='/details' /> : ''}
      </div>
    </div>
  )
}

export default Login