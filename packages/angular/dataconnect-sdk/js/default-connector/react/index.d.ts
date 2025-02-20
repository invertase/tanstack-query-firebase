import { ListMoviesData, GetMovieByIdData, GetMovieByIdVariables, CreateMovieData, CreateMovieVariables, UpsertMovieData, UpsertMovieVariables, DeleteMovieData, DeleteMovieVariables} from '../';
import { FlattenedQueryResult, useDataConnectQueryOptions, FlattenedMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { FirebaseError } from 'firebase/app';

export function useListMovies(options?: useDataConnectQueryOptions<ListMoviesData, undefined>): UseQueryResult<FlattenedQueryResult<ListMoviesData, undefined>, FirebaseError>;
export function useGetMovieById(vars: GetMovieByIdVariables, options?: useDataConnectQueryOptions<GetMovieByIdData, GetMovieByIdVariables>): UseQueryResult<FlattenedQueryResult<GetMovieByIdData, GetMovieByIdVariables>, FirebaseError>;
export function useCreateMovie(options?: useDataConnectMutationOptions<CreateMovieData, CreateMovieVariables, CreateMovieVariables>): UseMutationResult<FlattenedMutationResult<CreateMovieData, CreateMovieVariables>, FirebaseError, CreateMovieVariables>;
export function useUpsertMovie(options?: useDataConnectMutationOptions<UpsertMovieData, UpsertMovieVariables, UpsertMovieVariables>): UseMutationResult<FlattenedMutationResult<UpsertMovieData, UpsertMovieVariables>, FirebaseError, UpsertMovieVariables>;
export function useDeleteMovie(options?: useDataConnectMutationOptions<DeleteMovieData, DeleteMovieVariables, DeleteMovieVariables>): UseMutationResult<FlattenedMutationResult<DeleteMovieData, DeleteMovieVariables>, FirebaseError, DeleteMovieVariables>;
