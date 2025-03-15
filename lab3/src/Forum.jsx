import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from './auth/AuthWrapper';

function Forum() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate(); // For navigation after successful post
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // Fetch posts from the backend
        axios.get("http://localhost:5000/api/posts")
            .then(res => setPosts(res.data))
            .catch(err => console.log(err));
    }, []);

    const createPost = () => {
        if (!user) {
            alert("You must be logged in to create a post.");
            return;
        }

        // Make sure the user is logged in
        axios.post("http://localhost:5000/api/posts", { 
            title, 
            content, 
            username: user.username // Add the username to the post data
        })
        .then(res => {
            setPosts([...posts, res.data]); // Add the new post to the list of posts
            setTitle("");  // Clear input fields
            setContent(""); // Clear content field
        })
        .catch(err => console.log(err));
    };

    return (
        <div>
            <h1>Forum</h1>
            {user ? (
                <>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button onClick={createPost}>Create Post</button>
                </>
            ) : (
                <p>Please log in to create a post.</p>
            )}

            <h2>Posts</h2>
            {posts.map(post => (
                <div key={post._id}>
                    <Link to={`/post/${post._id}`}><h3>{post.title}</h3></Link>
                    <p>{post.content}</p>
                    <p><strong>Posted by:</strong> {post.username} {/* Display the username */} <strong> on </strong> {new Date(post.date).toLocaleString()} </p>
                    {/* Display comments for each post */}
                    <div className="comments-section">
                        <h4>Comments</h4>
                        {post.comments && post.comments.length > 0 ? (
                            post.comments
                                .filter(c => !c.deleted)  // Filter out deleted comments
                                .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date (ascending)
                                .slice(0,5) // Limit the number of comments displayed
                                .map((c, index) => (
                                    <div key={index} className="comment">
                                        <p><strong>{c.username}</strong>: {c.text}</p>
                                        {/* <small>{c.date.toLocaleString()}</small> Display the date in a human-readable format */}
                                    </div>
                                ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Forum;
