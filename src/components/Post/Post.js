import Avatar from "@material-ui/core/Avatar";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import firebase from "firebase/app";

import "./Post.css";
const Post = ({ username, user, caption, imageUrl, postId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;

    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      {/* header -> avatar + username */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="arsalan"
          src="https://eventcartel.com/media/news/18f5a497-d336-4c8b-abba-29301d686ff2.png"
        />
        <h3>{username}</h3>
      </div>

      {/* image */}
      <img src={imageUrl} alt="" className="post__image" />

      {/* usernmae + caption  */}
      <h4 className="post__text">
        <strong>{username}: </strong> {caption}
      </h4>

      {/* Comments */}
      <div className="post__comments">
        {comments.map((comment, index) => (
          <p key={index}>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            placeholder="Add a comment.."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
          />

          <button
            className="post__button"
            type="submit"
            disabled={!comment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
