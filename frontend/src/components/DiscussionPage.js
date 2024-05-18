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
        const messagesData = messagesResponse.data;

        if (messagesData.length > 0) {
          const messagesWithUserData = await Promise.all(messagesData.map(async message => {
            const userResponse = await axios.get(`http://localhost:3000/api/user/${message.userId}`);
            const userData = userResponse.data.data;

            const likesResponse = await axios.get(`http://localhost:3000/api/like/count?messageId=${message._id}`);
            const likesCount = likesResponse.data.likesCount;

            return { ...message, userData, likesCount };
          }));

          setMessages(messagesWithUserData);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
      }
    };

    fetchData();

    // Écouter les événements
    socket.on('messageCreated', fetchMessages);
    socket.on('messageLiked', fetchMessages);
    socket.on('messageUnliked', fetchMessages);
    socket.on('messageDeleted', fetchMessages);

    return () => {
      // Retirer les écouteurs d'événements lors du démontage du composant
      socket.off('messageCreated', fetchMessages);
      socket.off('messageLiked', fetchMessages);
      socket.off('messageUnliked', fetchMessages);
      socket.off('messageDeleted', fetchMessages);
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

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:3000/api/message/${messageId}`);
      // Émettre l'événement de suppression de message
      socket.emit('deleteMessage', messageId);
    } catch (error) {
      console.error('Erreur lors de la suppression du message :', error);
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
      {messages.length > 0 ? (
        <ul>
          {messages.map(message => (
            <li key={message._id}>
              <p>{message.content}</p>
              {message.userData && (
                <p>Créé par : {message.userData.firstName} {message.userData.lastName}</p>
              )}
              {user.userId === message.userId && (
                <button onClick={() => handleDeleteMessage(message._id)}>Supprimer le message</button>
              )}
              <LikeButton user={user} messageId={message._id} socket={socket} />
              <p>Total des likes : {message.likesCount}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Pas encore de message</p>
      )}

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
