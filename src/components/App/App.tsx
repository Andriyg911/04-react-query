import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-hot-toast';

import { fetchMovies, MoviesResponse } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import type { Movie } from '../../types/movie';
import styles from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<MoviesResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    placeholderData: (prev: MoviesResponse | undefined) => prev,
    enabled: !!query,
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1); // при новому пошуку завжди з першої сторінки
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  // ✅ показ повідомлення, якщо результатів немає
  useEffect(() => {
    if (isSuccess && data && data.results.length === 0) {
      toast('Фільми не знайдено');
    }
  }, [isSuccess, data]);

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {/* Пагінація зверху */}
      {data?.total_pages && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          onPageChange={handlePageClick}
          forcePage={page - 1} // ✅ синхронізація з state
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
        />
      )}

      {/* Сітка фільмів */}
      {data?.results && (
        <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
      )}

      {/* Пагінація знизу */}
      {data?.total_pages && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          onPageChange={handlePageClick}
          forcePage={page - 1} // ✅ синхронізація з state
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
        />
      )}

      {/* Модалка */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
