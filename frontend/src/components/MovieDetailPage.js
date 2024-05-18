import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the WebSocket server outside the component

function MovieDetailPage({ user }) {
  const { id } = useParams(); // Récupérer l'identifiant unique du film depuis les paramètres d'URL
  const [movieData, setMovieData] = useState(null);
  const [directorData, setDirectorData] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState(''); // Ajout du state pour le titre de la nouvelle discussion

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les données du film depuis le backend
        const movieResponse = await axios.get(`http://localhost:3000/api/movie/${id}`);
        setMovieData(movieResponse.data);

        // Récupérer les informations du réalisateur à partir de l'identifiant du réalisateur du film
        const directorResponse = await axios.get(`http://localhost:3000/api/celeb/${movieResponse.data.director}`);
        setDirectorData(directorResponse.data);

        // Récupérer les discussions associées à ce film
        const discussionsResponse = await axios.get(`http://localhost:3000/api/discussion?filmId=${id}`);
        const discussionsData = discussionsResponse.data;

        // Récupérer les informations de l'utilisateur associé à chaque discussion
        const discussionsWithUserData = await Promise.all(discussionsData.map(async discussion => {
          const userResponse = await axios.get(`http://localhost:3000/api/user/${discussion.userId}`);
          const userData = userResponse.data;
          const discussionWithUserData = { ...discussion, userData };
          return discussionWithUserData;
        }));

        setDiscussions(discussionsWithUserData);

      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();

    // Écouter l'événement de création de discussion
    socket.on('discussionCreated', (newDiscussion) => {
      setDiscussions((prevDiscussions) => [...prevDiscussions, newDiscussion]);
    });

    // Nettoyer la connexion WebSocket lors du démontage du composant
    return () => {
      socket.off('discussionCreated'); // Enlever seulement cet écouteur spécifique
    };
  }, [id]);

  const handleNewDiscussionSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(`User: ${user}`);
      // Envoyer une requête pour créer une nouvelle discussion avec le titre saisi
      const newDiscussion = {
        filmId: id,
        userId: user.userId, // Utilisation de l'ID de l'utilisateur connecté
        title: newDiscussionTitle
      };
      await axios.post(`http://localhost:3000/api/discussion`, newDiscussion);
      
      // Émettre l'événement de création de discussion
      socket.emit('createDiscussion', newDiscussion);

      // Effacer le champ du titre de la nouvelle discussion après l'envoi
      setNewDiscussionTitle('');

    } catch (error) {
      console.error('Erreur lors de la création de la nouvelle discussion :', error);
    }
  };

  return (
    <div>
      {movieData && directorData ? (
        <div>
          <h2>{movieData.title}</h2>
          <p>Date de sortie : {movieData.releaseYear}</p>
          <p>Réalisateur/Réalisatrice : {directorData.name}</p>
          <img src={movieData.posterURL} alt={`Poster ${movieData.title}`} style={{ width: '200px' }} />
        </div>
      ) : (
        <p>Chargement en cours...</p>
      )}

      <h3>Discussions associées :</h3>
      <ul>
        {discussions.map(discussion => (
          <li key={discussion._id}>
            {/* Utilisation de Link avec l'URL appropriée */}
            <Link to={`/discussion/${discussion._id}`}>
              <p>Titre : {discussion.title}</p>
            </Link>
            {discussion.userData && (
              <p>Créé par : {discussion.userData.data.firstName} {discussion.userData.data.lastName}</p>
            )}
          </li>
        ))}
      </ul>

      {/* Formulaire pour créer une nouvelle discussion */}
      <form onSubmit={handleNewDiscussionSubmit}>
        <input 
          type="text" 
          placeholder="Saisir un titre pour la nouvelle discussion" 
          value={newDiscussionTitle}
          onChange={(event) => setNewDiscussionTitle(event.target.value)} 
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default MovieDetailPage;
