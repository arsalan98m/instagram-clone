import Avatar from "@material-ui/core/Avatar";
import "./Post.css";
const Post = ({ username, caption, imageUrl }) => {
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
    </div>
  );
};

export default Post;
