import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMarvelAPI } from '../hooks/useMarvelAPI';
import PropTypes from 'prop-types';

function ComicDetails({ handleAddToReadingList, readingList }) {
  const [comic, setComic] = useState(null);
  const { id } = useParams();
  const { fetchMarvelData, loading } = useMarvelAPI();

  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const result = await fetchMarvelData(`comics/${id}`);
        setComic(result.data.results[0]);
      } catch (error) {
        console.error('Error fetching comic details:', error);
      }
    };

    fetchComicDetails();
  }, [id, fetchMarvelData]);

  const addToReadingList = () => {
    handleAddToReadingList(comic);
  };

  if (loading || !comic) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{comic.title}</h1>
      <img 
        src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} 
        alt={comic.title} 
      />
      <p>{comic.description || 'No description available.'}</p>
      <p>Series: {comic.series.name}</p>
      <p>Page Count: {comic.pageCount}</p>
      {readingList.some(item => item.id === comic.id) ? (
        <p>This comic is already in your reading list</p>
      ) : (
        <button onClick={addToReadingList}>Add to Reading List</button>
      )}
    </div>
  );
}

ComicDetails.propTypes = {
  handleAddToReadingList: PropTypes.func.isRequired,
  readingList: PropTypes.array.isRequired,
};

export default ComicDetails;