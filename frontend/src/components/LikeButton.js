import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LikeButton({ user, messageId }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/like/check?messageId=${messageId}&userId=${user.userId}`);
        setLiked(response.data.liked);
        setLikesCount(response.data.likesCount);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [messageId, user.userId]);

  const handleLike = async () => {
    // Logique de gestion du like ici
  };

  return (
    <button onClick={handleLike}>
      {liked ? 'Liké' : 'Pas Liké'} ({likesCount})
    </button>
  );
}

export default LikeButton;
