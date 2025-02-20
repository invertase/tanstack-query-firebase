import { listMoviesRef, getMovieByIdRef, createMovieRef, upsertMovieRef, deleteMovieRef } from '../../';
import { useDataConnectQuery, useDataConnectMutation } from '@tanstack-query-firebase/react/data-connect';





export function useListMovies( options) {
  return useDataConnectQuery(listMoviesRef(), options);
}






export function useGetMovieById(vars,  options) {
  return useDataConnectQuery(getMovieByIdRef(vars), options);
}






export function useCreateMovie(options) {
  return useDataConnectMutation(createMovieRef, options);
}






export function useUpsertMovie(options) {
  return useDataConnectMutation(upsertMovieRef, options);
}






export function useDeleteMovie(options) {
  return useDataConnectMutation(deleteMovieRef, options);
}



