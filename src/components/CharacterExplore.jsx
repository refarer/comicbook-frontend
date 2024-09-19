import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMarvelAPI } from '../hooks/useMarvelAPI';
import { useDebounce } from '../hooks/useDebounce';

function CharacterExplore() {
    const [characters, setCharacters] = useState([]);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const observerTarget = useRef(null);
    const { fetchMarvelData } = useMarvelAPI();
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const debouncedNameFilter = useDebounce(nameFilter, 300); // 300ms delay

    const fetchCharacters = useCallback(async () => {
        try {
            setLoading(true);
            setInitialLoadDone(true);
            const params = {
                limit: 20,
                offset,
            };
            if (debouncedNameFilter) {
                params.nameStartsWith = debouncedNameFilter;
            }
            const results = await fetchMarvelData('characters', params);
            setCharacters(prevCharacters =>
                offset === 0 ? results.data.results : [...prevCharacters, ...results.data.results]
            );
            setOffset(prevOffset => prevOffset + 20);
            setTotal(results.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching characters:', error);
            setLoading(false);
        }
    }, [offset, fetchMarvelData, debouncedNameFilter]);

    useEffect(() => {
        if (!initialLoadDone && !loading) {
            fetchCharacters();
        }
    }, [fetchCharacters, initialLoadDone, loading]);

    useEffect(() => {
        if (!initialLoadDone || characters.length >= total) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    fetchCharacters();
                }
            },
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [fetchCharacters, initialLoadDone, characters.length, total]);

    const handleFilterChange = (e) => {
        setNameFilter(e.target.value);
    };

    useEffect(() => {
        setOffset(0);
        setCharacters([]);
    }, [debouncedNameFilter]);

    return (
        <div>
            <h1>Explore Marvel Characters</h1>
            <input
                type="text"
                placeholder="Filter by character name"
                value={nameFilter}
                onChange={handleFilterChange}
                className="character-filter-input"
            />
            <div className="character-grid">
                {characters.map(character => (
                    <Link to={`/character/${character.id}`} key={character.id} className="character-card">
                        <img
                            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                            alt={character.name}
                        />
                        <h3>{character.name}</h3>
                    </Link>
                ))}
            </div>
            <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }}>
                {loading && <p>Loading characters...</p>}
                {!loading && characters.length >= total && (
                    <p>All characters loaded. Total: {total}</p>
                )}
            </div>
        </div>
    );
}

export default CharacterExplore;