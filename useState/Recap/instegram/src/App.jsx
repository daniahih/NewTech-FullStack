import { useState } from "react";

export default function App() {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");

  const toogleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };
  const handelComment = (e) => {
    setComment(e.target.value);
  };

  return (
    <div>
      <h2>{likes}</h2>
      <input type="text" value={comment} onChange={handelComment} />
      <p>Your Comment is : {comment}</p>
      <button onClick={toogleLike}>{isLiked ? "Unlike" : "Like"}</button>
    </div>
  );
}
