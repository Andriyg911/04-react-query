import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import styles from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        {typeof movie.backdrop_path === 'string' &&
          movie.backdrop_path.trim() !== '' && (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className={styles.image}
            />
          )}

        <div className={styles.content}>
          <h2 className={styles.title}>{movie.title}</h2>

          <p className={styles.info}>
            <strong>Release date:</strong>{' '}
            {movie.release_date?.trim() || 'Unknown'}
          </p>

          <p className={styles.info}>
            <strong>Rating:</strong>{' '}
            {typeof movie.vote_average === 'number'
              ? `${movie.vote_average.toFixed(1)} / 10`
              : 'N/A'}
          </p>

          {movie.overview && (
            <p className={styles.overview}>{movie.overview}</p>
          )}
        </div>
      </div>
    </div>,
    modalRoot
  );
}