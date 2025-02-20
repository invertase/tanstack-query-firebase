import { ListMoviesData, GetMovieByIdData, GetMovieByIdVariables, CreateMovieData, CreateMovieVariables, UpsertMovieData, UpsertMovieVariables, DeleteMovieData, DeleteMovieVariables } from '../';
export { ListMoviesData, GetMovieByIdData, GetMovieByIdVariables, CreateMovieData, CreateMovieVariables, UpsertMovieData, UpsertMovieVariables, DeleteMovieData, DeleteMovieVariables } from '../';
export { TimestampString, UUIDString, Int64String, DateString } from '../';
import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise} from '@angular/fire/data-connect';
import { FlattenedQueryResult, CreateDataConnectQueryOptions, FlattenedMutationResult, CreateDataConnectMutationOptions} from '@tanstack-query-firebase/angular/data-connect';
import { CreateQueryResult, CreateMutationResult} from '@tanstack/angular-query-experimental';

export const connectorConfig: ConnectorConfig;

/* Allow users to create refs without passing in DataConnect */
export function listMoviesRef(): QueryRef<ListMoviesData, undefined>;
/* Allow users to pass in custom DataConnect instances */
export function listMoviesRef(dc: DataConnect): QueryRef<ListMoviesData, undefined>;

export function listMovies(): QueryPromise<ListMoviesData, undefined>;
export function listMovies(dc: DataConnect): QueryPromise<ListMoviesData, undefined>;




type ListMoviesOptions = () => Omit<CreateDataConnectQueryOptions<ListMoviesData, undefined>, 'queryFn'>;
export function injectListMovies(options?: ListMoviesOptions): CreateQueryResult<FlattenedQueryResult<ListMoviesData, undefined>, FirebaseError, undefined>;



/* Allow users to create refs without passing in DataConnect */
export function getMovieByIdRef(vars: GetMovieByIdVariables): QueryRef<GetMovieByIdData, GetMovieByIdVariables>;
/* Allow users to pass in custom DataConnect instances */
export function getMovieByIdRef(dc: DataConnect, vars: GetMovieByIdVariables): QueryRef<GetMovieByIdData, GetMovieByIdVariables>;

export function getMovieById(vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;
export function getMovieById(dc: DataConnect, vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;




type GetMovieByIdArgs = GetMovieByIdVariables | (() => GetMovieByIdVariables);

type GetMovieByIdOptions = () => Omit<CreateDataConnectQueryOptions<GetMovieByIdData, GetMovieByIdVariables>, 'queryFn'>;
export function injectGetMovieById(args: GetMovieByIdArgs, options?: GetMovieByIdOptions): CreateQueryResult<FlattenedQueryResult<GetMovieByIdData, GetMovieByIdVariables>, FirebaseError, GetMovieByIdVariables>;



/* Allow users to create refs without passing in DataConnect */
export function createMovieRef(vars: CreateMovieVariables): MutationRef<CreateMovieData, CreateMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function createMovieRef(dc: DataConnect, vars: CreateMovieVariables): MutationRef<CreateMovieData, CreateMovieVariables>;

export function createMovie(vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;
export function createMovie(dc: DataConnect, vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;



type CreateMovieOptions = () => Omit<CreateDataConnectMutationOptions<CreateMovieData, CreateMovieVariables>, 'mutationFn'>;
export function injectCreateMovie(options?: CreateMovieOptions): CreateMutationResult<CreateMovieData, FirebaseError, CreateMovieVariables>;



/* Allow users to create refs without passing in DataConnect */
export function upsertMovieRef(vars: UpsertMovieVariables): MutationRef<UpsertMovieData, UpsertMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function upsertMovieRef(dc: DataConnect, vars: UpsertMovieVariables): MutationRef<UpsertMovieData, UpsertMovieVariables>;

export function upsertMovie(vars: UpsertMovieVariables): MutationPromise<UpsertMovieData, UpsertMovieVariables>;
export function upsertMovie(dc: DataConnect, vars: UpsertMovieVariables): MutationPromise<UpsertMovieData, UpsertMovieVariables>;



type UpsertMovieOptions = () => Omit<CreateDataConnectMutationOptions<UpsertMovieData, UpsertMovieVariables>, 'mutationFn'>;
export function injectUpsertMovie(options?: UpsertMovieOptions): CreateMutationResult<UpsertMovieData, FirebaseError, UpsertMovieVariables>;



/* Allow users to create refs without passing in DataConnect */
export function deleteMovieRef(vars: DeleteMovieVariables): MutationRef<DeleteMovieData, DeleteMovieVariables>;
/* Allow users to pass in custom DataConnect instances */
export function deleteMovieRef(dc: DataConnect, vars: DeleteMovieVariables): MutationRef<DeleteMovieData, DeleteMovieVariables>;

export function deleteMovie(vars: DeleteMovieVariables): MutationPromise<DeleteMovieData, DeleteMovieVariables>;
export function deleteMovie(dc: DataConnect, vars: DeleteMovieVariables): MutationPromise<DeleteMovieData, DeleteMovieVariables>;



type DeleteMovieOptions = () => Omit<CreateDataConnectMutationOptions<DeleteMovieData, DeleteMovieVariables>, 'mutationFn'>;
export function injectDeleteMovie(options?: DeleteMovieOptions): CreateMutationResult<DeleteMovieData, FirebaseError, DeleteMovieVariables>;






