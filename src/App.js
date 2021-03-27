import './App.css';
import Post from './Post';
import ImageUpload from './ImageUpload'
import React, { useEffect, useState } from 'react'
import { db ,auth } from './firebase'
import Modal from '@material-ui/core/Modal';
import { Button, Input, makeStyles } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([])
  const [open,setOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [openLogin,setOpenLogin] = useState(false)
  

  function handleSignUp(event)
  { 
    event.preventDefault()
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) =>{
      authUser.user.updateProfile({
        displayName:userName
      })
    })
    .catch((error) => alert(error.message))
    setOpen(false)
  }

  function handleLogin(event)
  { 
    event.preventDefault()
    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))
    setOpenLogin(false)
  }

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((authUser) => {
     if(authUser){
       //user has logged in
       setUser(authUser)
     }else{
       //user has logged out ..
       setUser(null)
     }
   })

   return() => {
     unsubscribe()
   }
  }, [userName,user])

  useEffect(() => {
    db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapShot =>{
      setPosts(snapShot.docs.map(doc => ({id:doc.id,posts:doc.data()}) ))
    }  )
  },[]);
  

  return (
    <div className="App">
      
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_header_image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
            </center>
            <Input placeholder="Username" type="text" value={userName} onChange={event => setUserName(event.target.value)}/>
            <Input placeholder="Email" type="text" value={email} onChange={event => setEmail(event.target.value)}/>
            <Input placeholder="Password" type="text" value={password} onChange={event => setPassword(event.target.value)}/>
            <Button type="submit" onClick={event => handleSignUp(event)}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_login">
            <center>
              <img className="app_header_image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
            </center>
            <Input placeholder="Email" type="text" value={email} onChange={event => setEmail(event.target.value)}/>
            <Input placeholder="Password" type="text" value={password} onChange={event => setPassword(event.target.value)}/>
            <Button type="submit" onClick={event => handleLogin(event)}>Log In</Button>
          </form>
        </div>
      </Modal>
     
     <div className="app_header">
       <img className="app_headerImage" 
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
       alt="" />
        {user?(<Button onClick={() => auth.signOut()}>Sign Out</Button>)
        :
        (<div className="app_loginCOntainer">
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button onClick={() => setOpenLogin(true)}>Login</Button>
          </div>
        )}
     </div>
     <div className="app_posts">
       
          {/* {console.log(user.displayName)} */}
          {posts.map(function (item) {
            return <Post key={item.id} postId = {item.id} data={item.posts} user={user}/>
              })}
       
      
     
     </div>
    
      {user?.displayName?(<ImageUpload userName={user.displayName}/>):<h3 style={{textAlign : "center"}}>Login to Upload</h3>
      }
     </div>
  );
}

export default App;
