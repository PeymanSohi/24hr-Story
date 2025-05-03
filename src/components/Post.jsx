import React, { useState } from 'react';

function Post({ post, onLike, onComment }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id, !isLiked);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-user-info">
          <img src={post.userAvatar} alt={post.username} className="post-avatar" />
          <span className="post-username">{post.username}</span>
        </div>
        <button className="post-more">•••</button>
      </div>

      <div className="post-image-container">
        <img src={post.image} alt="post" className="post-image" />
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '❤️' : '🤍'}
          </button>
          <button className="comment-button" onClick={() => setShowComments(!showComments)}>
            💬
          </button>
          <button className="share-button">📤</button>
        </div>
        <button className="save-button">🔖</button>
      </div>

      <div className="post-likes">
        {post.likes} likes
      </div>

      <div className="post-caption">
        <span className="post-username">{post.username}</span>
        <span className="post-caption-text">{post.caption}</span>
      </div>

      {showComments && (
        <div className="post-comments">
          {post.comments?.map((comment, index) => (
            <div key={index} className="post-comment">
              <span className="comment-username">{comment.username}</span>
              <span className="comment-text">{comment.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="post-timestamp">
        {formatTime(post.timestamp)}
      </div>

      <form className="post-comment-form" onSubmit={handleComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="post-comment-input"
        />
        <button 
          type="submit" 
          className="post-comment-submit"
          disabled={!newComment.trim()}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Post; 