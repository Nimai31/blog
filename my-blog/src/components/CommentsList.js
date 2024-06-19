import axios from "axios";
import { useState } from "react";
import useUser from "../hooks/useUser";

const CommentsList = ({ comments, articleName, onArticleUpdated }) => {
  const { user } = useUser();
  const [updatedCommentText, setUpdatedCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null); // Track which comment is being edited

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

  const updateComment = async (commentId, updatedText) => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const response = await axios.put(
      `/api/articles/${articleName}/comments`,
      { text: comments[commentId].text, updatedText },
      { headers }
    );
    const updatedArticle = response.data;
    onArticleUpdated(updatedArticle);
    setEditingCommentId(null); // Exit edit mode after updating
  };

  const handleEdit = (commentId) => {
    setEditingCommentId(commentId); // Set the comment ID being edited
    setUpdatedCommentText(comments[commentId].text); // Initialize updated text with current text
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null); // Cancel edit mode
    setUpdatedCommentText(""); // Clear updated text
  };

  return (
    <>
      <h3>Comments:</h3>
      {comments.map((comment, index) => (
        <div className="comment" key={index}>
          <h4>{comment.postedBy}</h4>
          {editingCommentId === index ? (
            <>
              <input
                type="text"
                value={updatedCommentText}
                onChange={(e) => setUpdatedCommentText(e.target.value)}
              />
              <button onClick={() => updateComment(index, updatedCommentText)}>
                Update
              </button>
              <button onClick={() => handleCancelEdit()}>Cancel</button>
            </>
          ) : (
            <p>{comment.text}</p>
          )}
          {user && user.email === comment.postedBy && (
            <>
              {editingCommentId !== index && (
                <button onClick={() => handleEdit(index)}>Edit</button>
              )}
              <button onClick={() => deleteComment(comment.text)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default CommentsList;
