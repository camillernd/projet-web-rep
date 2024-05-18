import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function MovieDetailPage({ user, socket }) {
  const { id } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [directorData, setDirectorData] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await axios.get(`http://localhost:3000/api/movie/${id}`);
        setMovieData(movieResponse.data);

        const directorResponse = await axios.get(`http://localhost:3000/api/celeb/${movieResponse.data.director}`);
        setDirectorData(directorResponse.data);

        fetchDiscussions();
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    const fetchDiscussions = async () => {
      try {
        const discussionsResponse = await axios.get(`http://localhost:3000/api/discussion?filmId=${id}`);
        setDiscussions(discussionsResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des discussions :', error);
      }
    };

    fetchData();

    // Écouter l'événement de création de discussion
    socket.on('discussionCreated', () => {
      fetchDiscussions();
    });

    // Écouter l'événement de suppression de discussion
    socket.on('discussionDeleted', (deletedDiscussionId) => {
      fetchDiscussions();
    });

    return () => {
      socket.off('discussionCreated');
      socket.off('discussionDeleted');
    };
  }, [id, socket, discussions]);

  const handleNewDiscussionSubmit = async (event) => {
    event.preventDefault();
    try {
      const newDiscussion = {
        filmId: id,
        userId: user.userId,
        title: newDiscussionTitle
      };
      await axios.post(`http://localhost:3000/api/discussion`, newDiscussion);
      
      // Émettre l'événement de création de discussion
      socket.emit('createDiscussion', newDiscussion);

      setNewDiscussionTitle('');

    } catch (error) {
      console.error('Erreur lors de la création de la nouvelle discussion :', error);
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    try {
      await axios.delete(`http://localhost:3000/api/discussion/${discussionId}`);
      // Émettre l'événement de suppression de discussion
      socket.emit('deleteDiscussion', discussionId);
      
    } catch (error) {
      console.error('Erreur lors de la suppression de la discussion :', error);
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
            <Link to={`/discussion/${discussion._id}`}>
              <p>Titre : {discussion.title}</p>
            </Link>
            {user.userId === discussion.userId && (
              <button onClick={() => handleDeleteDiscussion(discussion._id)}>Supprimer la discussion</button>
            )}
          </li>
        ))}
      </ul>

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
