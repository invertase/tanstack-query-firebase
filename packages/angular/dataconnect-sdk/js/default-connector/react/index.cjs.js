const { listMoviesRef, getMovieByIdRef, createMovieRef, upsertMovieRef, deleteMovieRef } = require('../');
const { useDataConnectQuery, useDataConnectMutation } = require( '@tanstack-query-firebase/react/data-connect');





exports.useListMovies = function useListMovies( options) {
  return useDataConnectQuery(listMoviesRef(), options);
}






exports.useGetMovieById = function useGetMovieById(vars,  options) {
  return useDataConnectQuery(getMovieByIdRef(vars), options);
}






exports.useCreateMovie = function useCreateMovie(options) {
  return useDataConnectMutation(createMovieRef, options);
}






exports.useUpsertMovie = function useUpsertMovie(options) {
  return useDataConnectMutation(upsertMovieRef, options);
}






exports.useDeleteMovie = function useDeleteMovie(options) {
  return useDataConnectMutation(deleteMovieRef, options);
}




