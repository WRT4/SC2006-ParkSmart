import { Link, useNavigate } from "react-router-dom";

export default function ForumCard(post) {
  post = post.post;
  return (
    <div className="flex items-center justify-center">
      <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-2xl font-semibold">{post.title}</p>
        <p>{post.content}</p>
        {post.image && (
          <img
            src={
              post.image.startsWith("data:") || post.image.startsWith("http")
                ? post.image
                : `data:image/jpeg;base64,${post.image}`
            }
            alt="Post Image"
            className="mt-2 w-[200px] justify-self-center"
          />
        )}{" "}
        {/* Image display */}
        <p className="text-sm text-gray-600">
          Posted by: {post.username},{/* Display the username */}{" "}
          {timeSince(new Date(post.date).getTime())}
        </p>
        <div className="flex items-center justify-between">
          <Link
            to={`/forum/post/${post._id}`}
            className="mt-2 cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            View Post
          </Link>
          <p className="text-sm text-gray-600">
            {post.comments.length} comments
          </p>
        </div>
      </div>
    </div>
  );
}

function timeSince(timeStamp) {
  const seconds = new Date().getTime();
  const difference = (seconds - timeStamp) / 1000;
  let output = ``;
  if (difference < 60) {
    // Less than a minute has passed:
    output = `${Math.floor(difference)} seconds ago`;
  } else if (difference < 3600) {
    // Less than an hour has passed:
    output = `${Math.floor(difference / 60)} minutes ago`;
  } else if (difference < 86400) {
    // Less than a day has passed:
    output = `${Math.floor(difference / 3600)} hours ago`;
  } else if (difference < 2620800) {
    // Less than a month has passed:
    output = `${Math.floor(difference / 86400)} days ago`;
  } else if (difference < 31449600) {
    // Less than a year has passed:
    output = `${Math.floor(difference / 2620800)} months ago`;
  } else {
    // More than a year has passed:
    output = `${Math.floor(difference / 31449600)} years ago`;
  }
  return output;
}
