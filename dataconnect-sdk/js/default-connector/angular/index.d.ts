import { CreateMovieData, CreateMovieVariables, UpsertMovieData, UpsertMovieVariables, DeleteMovieData, DeleteMovieVariables, ListMoviesData, GetMovieByIdData, GetMovieByIdVariables } from '../';
import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise} from '@angular/fire/data-connect';
import { CreateQueryResult, CreateMutationResult} from '@tanstack/angular-query-experimental';
import { FlattenedQueryResult, CreateDataConnectQueryOptions, FlattenedMutationResult, CreateDataConnectMutationOptions } from '@tanstack-query-firebase/angular/data-connect';
import { FirebaseError } from 'firebase/app';

export { TimestampString, UUIDString, Int64String, DateString } from '../';


type CreateMovieOptions = () => Omit<CreateDataConnectMutationOptions<CreateMovieData, CreateMovieVariables>, 'mutationFn'>;
export function injectCreateMovie(options?: CreateMovieOptions, injector?: Injector): CreateMutationResult<CreateMovieData, FirebaseError, CreateMovieVariables>;

type UpsertMovieOptions = () => Omit<CreateDataConnectMutationOptions<UpsertMovieData, UpsertMovieVariables>, 'mutationFn'>;
export function injectUpsertMovie(options?: UpsertMovieOptions, injector?: Injector): CreateMutationResult<UpsertMovieData, FirebaseError, UpsertMovieVariables>;

type DeleteMovieOptions = () => Omit<CreateDataConnectMutationOptions<DeleteMovieData, DeleteMovieVariables>, 'mutationFn'>;
export function injectDeleteMovie(options?: DeleteMovieOptions, injector?: Injector): CreateMutationResult<DeleteMovieData, FirebaseError, DeleteMovieVariables>;

export type ListMoviesOptions = () => Omit<CreateDataConnectQueryOptions<ListMoviesData, undefined>, 'queryFn'>;
export function injectListMovies(options?: ListMoviesOptions, injector?: Injector): CreateQueryResult<FlattenedQueryResult<ListMoviesData, FirebaseError>>;

type GetMovieByIdArgs = GetMovieByIdVariables | (() => GetMovieByIdVariables);
export type GetMovieByIdOptions = () => Omit<CreateDataConnectQueryOptions<GetMovieByIdData, GetMovieByIdVariables>, 'queryFn'>;
export function injectGetMovieById(args: GetMovieByIdArgs, options?: GetMovieByIdOptions, injector?: Injector): CreateQueryResult<FlattenedQueryResult<GetMovieByIdData, FirebaseError>>;
