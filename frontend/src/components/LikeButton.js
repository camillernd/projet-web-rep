// LikeButton.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LikeButton({ user, messageId, socket }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/like/check?messageId=${messageId}&userId=${user.userId}`);
        setLiked(response.data.liked);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [messageId, user.userId]);

  const handleLike = async () => {
    try {
      if (liked) {
        console.log('on est bien entrés ici')
        console.log(messageId);
        console.log(user.userId);
        await axios.delete('http://localhost:3000/api/like', {
            data: {
                messageId: messageId,
                userId: user.userId
            }
        });
        setLiked(false);
        socket.emit('unlikeMessage', { messageId: messageId, userId: user.userId }); // Émettre un événement unlikeMessage
      } else {
        await axios.post(`http://localhost:3000/api/like`, { messageId, userId: user.userId });
        setLiked(true);
        socket.emit('likeMessage', { messageId: messageId, userId: user.userId }); // Émettre un événement likeMessage
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  return (
    <button onClick={handleLike}>
      {liked ? 'Liké' : 'Pas Liké'}
    </button>
  );
}

export default LikeButton;
