import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthWrapper";
// import './styles/PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // For programmatic navigation
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment being edited
  const [editedCommentText, setEditedCommentText] = useState(""); // Store the edited text
  const { user } = useContext(AuthContext);
  const [reportText, setReportText] = useState(""); // State to hold report text
  const [reportingPost, setReportingPost] = useState(false); // Track if reporting post
  const [reportingCommentId, setReportingCommentId] = useState(null); // Track comment being reported
  const [image, setImage] = useState("");

  useEffect(() => {
    // Fetch the specific post by its ID
    axios
      .get(`http://localhost:5000/api/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setImage(res.data.image || "");
      })
      .catch((err) => console.log(err));
  }, [id]);

  const addComment = () => {
    // Post the new comment to the backend
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }
    if (comment.trim() === "") {
      alert("Comment cannot be empty.");
      return;
    }
    // Post the new comment to the backend
    axios
      .post(`http://localhost:5000/api/posts/${id}/comments`, {
        username: user.username, // Include the logged-in user's username
        text: comment,
      })
      .then((res) => {
        // After successfully adding the comment, update the post data
        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, res.data], // Append the new comment
        }));
        setComment(""); // Clear the comment input field after submitting
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong. Please try again.");
      });
  };

  const editPost = () => {
    if (user.username !== post.username) {
      alert("You can only edit your own posts.");
      return;
    }
    // Redirect to the edit post page
    navigate(`/forum/post/${id}/edit`);
  };

  const deletePost = () => {
    if (user.username !== post.username) {
      alert("You can only delete your own posts.");
      return;
    }
    // Confirm deletion with the user
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (confirmDelete) {
      // Delete the post from the backend
      axios
        .patch(`http://localhost:5000/api/posts/${id}`, { deleted: true })
        .then(() => {
          // After successfully deleting the post, redirect to the forum page
          navigate("/forum");
        })
        .catch((err) => console.log(err));
    }
  };

  // Edit Comment Functionality
  const editComment = (commentId, currentText) => {
    // Start editing the comment by setting the current text
    setEditingCommentId(commentId);
    setEditedCommentText(currentText); // Populate the input with the current comment text
  };

  // Save the edited comment
  const saveComment = (commentId) => {
    if (!editedCommentText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    // Send the updated comment to the backend
    axios
      .put(`http://localhost:5000/api/posts/${id}/comments/${commentId}`, {
        text: editedCommentText,
      })
      .then((res) => {
        // After successfully updating the comment, update the UI
        setPost((prevPost) => ({
          ...prevPost,
          comments: prevPost.comments.map((c) =>
            c._id === commentId ? { ...c, text: editedCommentText } : c,
          ),
        }));
        setEditingCommentId(null); // Reset editing state
        setEditedCommentText(""); // Clear the input field
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong. Please try again.");
      });
  };

  const deleteComment = (commentId) => {
    if (user.username !== post.username) {
      alert("You can only delete your own comments.");
      return;
    }
    // Confirm deletion with the user
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?",
    );
    if (confirmDelete) {
      // Delete the comment from the backend
      axios
        .delete(`http://localhost:5000/api/posts/${id}/comments/${commentId}`)
        .then(() => {
          // After successfully deleting the comment, update the comments array
          setPost((prevPost) => ({
            ...prevPost,
            comments: prevPost.comments.filter((c) => c._id !== commentId),
          }));
        })
        .catch((err) => console.log(err));
    }
  };

  const reportPost = () => {
    if (!reportText.trim()) {
      alert("Please provide a reason for reporting.");
      return;
    }
    axios
      .post(`http://localhost:5000/api/posts/${id}/report`, {
        username: user.username,
        report: reportText,
      })
      .then((res) => {
        alert("Post reported successfully");
        setReportingPost(false); // Hide the report box
        setReportText(""); // Reset the report text
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong. Please try again.");
      });
  };

  const reportComment = (commentId) => {
    if (!reportText.trim()) {
      alert("Please provide a reason for reporting.");
      return;
    }
    axios
      .post(
        `http://localhost:5000/api/posts/${id}/comments/${commentId}/report`,
        {
          username: user.username,
          report: reportText,
        },
      )
      .then((res) => {
        alert("Comment reported successfully");
        setReportingCommentId(null); // Hide the report box
        setReportText(""); // Reset the report text
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong. Please try again.");
      });
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {image && (
        <div>
          <img
            src={image}
            alt="Post Image"
            style={{ width: "200px", marginTop: "10px" }}
          />
        </div>
      )}
      <p>
        <strong>Posted by:</strong> {post.username} <strong> on </strong>{" "}
        {new Date(post.date).toLocaleString()}
      </p>

      {/* Conditionally render Edit and Delete buttons */}
      {user && user.username === post.username && (
        <>
          <button onClick={editPost}>Edit Post</button>
          <button onClick={deletePost}>Delete Post</button>
        </>
      )}

      {user && user.username !== post.username && (
        <>
          <button onClick={() => setReportingPost(true)}>Report Post</button>
        </>
      )}

      {/* Show report input for post if reportingPost is true */}
      {reportingPost && (
        <div>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Enter your reason for reporting the post"
          />
          <button onClick={reportPost}>Submit Report</button>
          <button onClick={() => setReportingPost(false)}>Cancel</button>
        </div>
      )}

      <div className="comment-section">
        <h2>Comments</h2>
        {post.comments && post.comments.length > 0 ? (
          post.comments
            .filter((c) => !c.deleted) // Filter out deleted comments
            .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date (ascending)
            .map((c, index) => (
              <div key={index} className="comment">
                <p>
                  <strong>{c.username}</strong>:{" "}
                  {editingCommentId === c._id ? (
                    <div>
                      <input
                        type="text"
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                      />
                      <button onClick={() => saveComment(c._id)}>Save</button>
                    </div>
                  ) : (
                    <span>{c.text}</span>
                  )}
                </p>
                <small>{new Date(c.date).toLocaleString()}</small>

                {/* Conditionally render Edit and Delete buttons for each comment */}
                {user && user.username === c.username && (
                  <>
                    <button onClick={() => editComment(c._id, c.text)}>
                      Edit Comment
                    </button>
                    <button onClick={() => deleteComment(c._id)}>
                      Delete Comment
                    </button>
                  </>
                )}

                {user && user.username !== c.username && (
                  <>
                    <button onClick={() => setReportingCommentId(c._id)}>
                      Report Comment
                    </button>
                  </>
                )}

                {/* Show report input for comment if reportingCommentId is the current comment ID */}
                {reportingCommentId === c._id && (
                  <div>
                    <textarea
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="Enter your reason for reporting the comment"
                    />
                    <button onClick={() => reportComment(c._id)}>
                      Submit Report
                    </button>
                    <button onClick={() => setReportingCommentId(null)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
        ) : (
          <p>No comments yet.</p>
        )}
        {user ? (
          <>
            <input
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={addComment}>Submit</button>
          </>
        ) : (
          <p>Please log in to comment.</p>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
