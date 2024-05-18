import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client'; // Importer la bibliothèque client Socket.IO

function DiscussionPage({ user }) {
  const { discussionId } = useParams();
  const [discussionData, setDiscussionData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [creatorData, setCreatorData] = useState(null);

  useEffect(() => {
    // Connexion au serveur WebSocket
    const socket = io('http://localhost:3000');

    // Écouter les événements de nouvelles discussions
    socket.on('discussionCreated', (newDiscussion) => {
      setDiscussionData(newDiscussion);
    });

    // Écouter les événements de nouveaux messages
    socket.on('messageCreated', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    const fetchData = async () => {
      try {
        const discussionResponse = await axios.get(`http://localhost:3000/api/discussion/${discussionId}`);
        setDiscussionData(discussionResponse.data);

        const userResponse = await axios.get(`http://localhost:3000/api/user/${discussionResponse.data.userId}`);
        setCreatorData(userResponse.data.data);

        const messagesResponse = await axios.get(`http://localhost:3000/api/message?discussionId=${discussionId}`);

        if (messagesResponse.data.length === 0) {
          setMessages([{ _id: 'placeholder', content: "Pas encore de message" }]);
        } else {
          const messagesWithUserData = await Promise.all(messagesResponse.data.map(async message => {
            const userResponse = await axios.get(`http://localhost:3000/api/user/${message.userId}`);
            const userData = userResponse.data.data;

            const likesResponse = await axios.get(`http://localhost:3000/api/like?messageId=${message._id}`);
            const likesCount = likesResponse.data.likesCount;

            const messageWithUserDataAndLikes = { ...message, userData, likesCount };
            return messageWithUserDataAndLikes;
          }));

          setMessages(messagesWithUserData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de la discussion :', error);
      }
    };

    fetchData();

    // Nettoyage de la connexion WebSocket lors du démontage du composant
    return () => {
      socket.disconnect();
    };
  }, [discussionId]);

  return (
    <div>
      {discussionData ? (
        <div>
          <h2>Titre de la discussion : {discussionData.title}</h2>
          {creatorData && (
            <p>Créé par : {creatorData.firstName} {creatorData.lastName}</p>
          )}
        </div>
      ) : (
        <p>Chargement en cours...</p>
      )}

      <h3>Messages associés :</h3>
      <ul>
        {messages.map(message => (
          <li key={message._id}>
            <p>{message.content}</p>
            {message.userData && (
              <p>Créé par : {message.userData.firstName} {message.userData.lastName}</p>
            )}
            <p>Likes: {message.likesCount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DiscussionPage;
