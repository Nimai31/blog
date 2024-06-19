import axios from "axios";
import useUser from "../hooks/useUser";

const CommentsList = ({ comments, articleName, onArticleUpdated }) => {
  const { user } = useUser();

  const deleteComment = async (commentText) => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const response = await axios.delete(
      `/api/articles/${articleName}/comments`,
      {
        headers,
        data: { text: commentText },
      }
    );
    const updatedArticle = response.data;
    onArticleUpdated(updatedArticle);
  };

  return (
    <>
      <h3>Comments:</h3>
      {comments.map((comment) => (
        <div className="comment" key={comment.postedBy + ": " + comment.text}>
          <h4>{comment.postedBy}</h4>
          <p>{comment.text}</p>
          {user && user.email === comment.postedBy && (
            <button onClick={() => deleteComment(comment.text)}>Delete</button>
          )}
        </div>
      ))}
    </>
  );
};

export default CommentsList;
