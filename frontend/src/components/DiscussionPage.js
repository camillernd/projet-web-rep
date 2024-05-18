import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LikeButton from './LikeButton'; // Importer le composant LikeButton

function DiscussionPage({ user, socket }) {
  const { discussionId } = useParams();
  const [discussionData, setDiscussionData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const discussionResponse = await axios.get(`http://localhost:3000/api/discussion/${discussionId}`);
        setDiscussionData(discussionResponse.data);

        fetchMessages(); // Appel initial pour récupérer les messages
      } catch (error) {
        console.error('Erreur lors de la récupération des données de la discussion :', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const messagesResponse = await axios.get(`http://localhost:3000/api/message?discussionId=${discussionId}`);

        if (messagesResponse.data.length === 0) {
          setMessages([{ _id: 'placeholder', content: "Pas encore de message" }]);
        } else {
          const messagesWithUserData = await Promise.all(messagesResponse.data.map(async message => {
            const userResponse = await axios.get(`http://localhost:3000/api/user/${message.userId}`);
            const userData = userResponse.data.data;

            const likesResponse = await axios.get(`http://localhost:3000/api/like/count?messageId=${message._id}`);
            const likesCount = likesResponse.data.likesCount;

            const messageWithUserDataAndLikes = { ...message, userData, likesCount };
            return messageWithUserDataAndLikes;
          }));

          setMessages(messagesWithUserData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
      }
    };

    fetchData();

    // Écouter l'événement de création de message
    socket.on('messageCreated', () => {
      fetchMessages(); // Appel de fetchMessages à chaque création de message
    });

    return () => {
      socket.off('messageCreated');
    };
  }, [discussionId, socket]);

  const handleNewMessageSubmit = async (event) => {
    event.preventDefault();
    try {
      const newMessage = {
        discussionId: discussionId,
        userId: user.userId,
        content: newMessageContent,
      };
      await axios.post(`http://localhost:3000/api/message`, newMessage);

      // Émettre l'événement de création de message
      socket.emit('createMessage', newMessage);

      setNewMessageContent(''); // Réinitialiser le contenu du nouveau message
      
    } catch (error) {
      console.error('Erreur lors de la création du nouveau message :', error);
    }
  };

  return (
    <div>
      {discussionData ? (
        <div>
          <h2>Titre de la discussion : {discussionData.title}</h2>
          {discussionData.userData && (
            <p>Créé par : {discussionData.userData.firstName} {discussionData.userData.lastName}</p>
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
            {/* Ajouter le bouton LikeButton avec les propriétés nécessaires */}
            <LikeButton user={user} messageId={message._id} />
          </li>
        ))}
      </ul>

      <form onSubmit={handleNewMessageSubmit}>
        <input 
          type="text" 
          placeholder="Saisir un nouveau message" 
          value={newMessageContent}
          onChange={(event) => setNewMessageContent(event.target.value)} 
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default DiscussionPage;
