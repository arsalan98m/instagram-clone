import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import React, { useState, useEffect } from "react";
import InstagramEmbed from "react-instagram-embed";

import "./App.css";

// Components
import Post from "./components/Post/Post";
import ImageUpload from "./components/ImageUpload/ImageUpload";

// Database
import { auth, db } from "./firebase";

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
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false); // using for modal
  const [open, setOpen] = useState(false); // using for modal
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  console.log("user=>", user);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in

        console.log("authuser->", authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // don't update
        } else {
          // if we just created someone..
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // User has logged out
        setUser(null);
      }
    });

    return () => {
      // perform some clean up functions
      unsubscribe();
    };
  }, [user, username]);

  // useEffect Runs a piece of code based on specific condition
  useEffect(() => {
    // this is where the code runs
    db.collection("posts")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        // every time a new post is added , this code fires
        setPosts(
          snapshot.docs.map((doc) => ({
            post: doc.data(),
            id: doc.id,
          }))
        );
      });
  }, []);

  const signup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .then(() => {
        setEmail("");
        setPassword("");
        setUsername("");
        setOpen(false);
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        console.log("sign in=>", authUser.user);
      })

      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="instagram-logo"
            />
            <form className="app__signup">
              <Input
                type="text"
                placeholder={"Enter Username"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="text"
                placeholder={"Enter email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder={"Enter password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signup}>
                Sign Up
              </Button>
            </form>
          </center>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="instagram-logo"
            />
            <form className="app__signup">
              <Input
                type="text"
                placeholder={"Enter email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder={"Enter password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>
                Sign in
              </Button>
            </form>
          </center>
        </div>
      </Modal>

      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram-logo"
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="login__container">
            <Button onClick={() => setOpen(true)}>Signup</Button>
            <Button onClick={() => setOpenSignIn(true)}>Signin</Button>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts?.map(({ post, id }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B_uf9dmAGPw/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login</h3>
      )}
    </div>
  );
}

export default App;
