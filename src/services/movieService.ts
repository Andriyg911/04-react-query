import axios from 'axios';
import type { Movie } from '../types/movie';

const API_URL = 'https://api.themoviedb.org/3/search/movie';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN as string;

export interface FetchMoviesParams {
  query: string;
  page?: number;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies({ query, page = 1 }: FetchMoviesParams): Promise<MoviesResponse> {
  if (!TOKEN) {
    throw new Error('TMDB token is missing. Please set VITE_TMDB_TOKEN in .env');
  }

  const config = {
    params: { query, page, include_adult: false, language: 'en-US' },
    headers: { Authorization: `Bearer ${TOKEN}` },
  };

  const response = await axios.get<MoviesResponse>(API_URL, config);
  return response.data;
}