import { CreateMovieData, CreateMovieVariables, UpsertMovieData, UpsertMovieVariables, DeleteMovieData, DeleteMovieVariables, ListMoviesData, GetMovieByIdData, GetMovieByIdVariables} from '../';
import { useDataConnectQueryOptions, FlattenedQueryResult, useDataConnectMutationOptions, FlattenedMutationResult} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';


export function useCreateMovie(options?: useDataConnectMutationOptions<CreateMovieData, CreateMovieVariables>): UseMutationResult<FlattenedMutationResult<CreateMovieData, CreateMovieVariables>, FirebaseError, CreateMovieVariables>;
export function useCreateMovie(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMovieData, CreateMovieVariables>): UseMutationResult<FlattenedMutationResult<CreateMovieData, CreateMovieVariables>, FirebaseError, CreateMovieVariables>;

export function useUpsertMovie(options?: useDataConnectMutationOptions<UpsertMovieData, UpsertMovieVariables>): UseMutationResult<FlattenedMutationResult<UpsertMovieData, UpsertMovieVariables>, FirebaseError, UpsertMovieVariables>;
export function useUpsertMovie(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertMovieData, UpsertMovieVariables>): UseMutationResult<FlattenedMutationResult<UpsertMovieData, UpsertMovieVariables>, FirebaseError, UpsertMovieVariables>;

export function useDeleteMovie(options?: useDataConnectMutationOptions<DeleteMovieData, DeleteMovieVariables>): UseMutationResult<FlattenedMutationResult<DeleteMovieData, DeleteMovieVariables>, FirebaseError, DeleteMovieVariables>;
export function useDeleteMovie(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteMovieData, DeleteMovieVariables>): UseMutationResult<FlattenedMutationResult<DeleteMovieData, DeleteMovieVariables>, FirebaseError, DeleteMovieVariables>;

export function useListMovies(options?: useDataConnectQueryOptions<ListMoviesData>): UseQueryResult<FlattenedQueryResult<ListMoviesData, undefined>, FirebaseError>;
export function useListMovies(dc: DataConnect, options?: useDataConnectQueryOptions<ListMoviesData>): UseQueryResult<FlattenedQueryResult<ListMoviesData, undefined>, FirebaseError>;

export function useGetMovieById(vars: GetMovieByIdVariables, options?: useDataConnectQueryOptions<GetMovieByIdData>): UseQueryResult<FlattenedQueryResult<GetMovieByIdData, GetMovieByIdVariables>, FirebaseError>;
export function useGetMovieById(dc: DataConnect, vars: GetMovieByIdVariables, options?: useDataConnectQueryOptions<GetMovieByIdData>): UseQueryResult<FlattenedQueryResult<GetMovieByIdData, GetMovieByIdVariables>, FirebaseError>;
