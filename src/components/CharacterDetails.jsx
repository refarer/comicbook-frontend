import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarvelAPI } from '../hooks/useMarvelAPI';

function CharacterDetails() {
  const [character, setCharacter] = useState(null);
  const { id } = useParams();
  const { fetchMarvelData, loading } = useMarvelAPI();

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const result = await fetchMarvelData(`characters/${id}`);
        setCharacter(result.data.results[0]);
      } catch (error) {
        console.error('Error fetching character details:', error);
      }
    };

    fetchCharacterDetails();
  }, [id, fetchMarvelData]);

  if (loading || !character) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{character.name}</h1>
      <img 
        src={`${character.thumbnail.path}.${character.thumbnail.extension}`} 
        alt={character.name} 
      />
      <p>{character.description || 'No description available.'}</p>
      <h2>Comics</h2>
      <ul>
        {character.comics.items.slice(0, 5).map(comic => (
          <li key={comic.resourceURI}>
            <Link to={`/comics/${comic.resourceURI.split('/').pop()}`}>
              {comic.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharacterDetails;