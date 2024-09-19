import PropTypes from 'prop-types';

function ReadingList({ readingList, handleRemoveFromReadingList }) {

  return (
    <div>
      <h2>My Reading List</h2>
      {readingList.length === 0 ? (
        <p>Your reading list is empty.</p>
      ) : (
        <ul>
          {readingList.map((item) => (
            <li key={item.id}>
              {item.title}
              <button onClick={() => handleRemoveFromReadingList(item)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

ReadingList.propTypes = {
  readingList: PropTypes.array.isRequired,
  handleRemoveFromReadingList: PropTypes.func.isRequired,
};

export default ReadingList;