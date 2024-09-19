import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

function ReadingListPreview({ readingList, onClose }) {
    return (
        <div className="reading-list-preview">
            <h3>Reading List Preview</h3>
            <button onClick={onClose}>Close</button>
            <ul>
                {readingList.map((book) => (
                    <li key={book.id}>
                        <Link to={`/comics/${book.id}`}>{book.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

ReadingListPreview.propTypes = {
    readingList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ReadingListPreview