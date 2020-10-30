import { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "../../firebase";
import firebase from "firebase/app";
import "./ImageUpload.css";

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState("");
  const [progrss, setProgress] = useState(0);
  const [image, setImage] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uplodaTask = storage.ref(`images/${image.name}`).put(image);
    uplodaTask.on(
      "state_changed",
      (snapshot) => {
        // progress function.....
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error function
        console.log(error);
      },
      () => {
        // complete function once we have done
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post image inside db
            db.collection("posts").add({
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });

            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress value={progrss} max="100" className="imageupload__progress" />
      {/* Caption input */}
      <input
        type="text"
        placeholder="Enter a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      {/* File picker */}
      <input type="file" onChange={handleChange} />

      {/* Post Button */}
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
