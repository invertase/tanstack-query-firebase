import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface CreateMovieData {
  movie_insert: Movie_Key;
}

export interface CreateMovieVariables {
  title: string;
  genre: string;
  imageUrl: string;
}

export interface DeleteMovieData {
  movie_delete?: Movie_Key | null;
}

export interface DeleteMovieVariables {
  id: UUIDString;
}

export interface GetMovieByIdData {
  movie?: {
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
  } & Movie_Key;
}

export interface GetMovieByIdVariables {
  id: UUIDString;
}

export interface ListMoviesData {
  movies: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
  } & Movie_Key)[];
}

export interface MovieMetadata_Key {
  id: UUIDString;
  __typename?: 'MovieMetadata_Key';
}

export interface Movie_Key {
  id: UUIDString;
  __typename?: 'Movie_Key';
}

export interface UpsertMovieData {
  movie_upsert: Movie_Key;
}

export interface UpsertMovieVariables {
  id: UUIDString;
  title: string;
  imageUrl: string;
}


/* Allow users to create refs without passing in DataConnect */
export function createMovieRef(vars: CreateMovieVariables): (MutationRef<CreateMovieData, CreateMovieVariables> & { __angular?: false });
/* Allow users to pass in custom DataConnect instances */
export function createMovieRef(dc: DataConnect, vars: CreateMovieVariables): (MutationRef<CreateMovieData, CreateMovieVariables> & { __angular?: false });

export function createMovie(vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;
export function createMovie(dc: DataConnect, vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function upsertMovieRef(vars: UpsertMovieVariables): (MutationRef<UpsertMovieData, UpsertMovieVariables> & { __angular?: false });
/* Allow users to pass in custom DataConnect instances */
export function upsertMovieRef(dc: DataConnect, vars: UpsertMovieVariables): (MutationRef<UpsertMovieData, UpsertMovieVariables> & { __angular?: false });

export function upsertMovie(vars: UpsertMovieVariables): MutationPromise<UpsertMovieData, UpsertMovieVariables>;
export function upsertMovie(dc: DataConnect, vars: UpsertMovieVariables): MutationPromise<UpsertMovieData, UpsertMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function deleteMovieRef(vars: DeleteMovieVariables): (MutationRef<DeleteMovieData, DeleteMovieVariables> & { __angular?: false });
/* Allow users to pass in custom DataConnect instances */
export function deleteMovieRef(dc: DataConnect, vars: DeleteMovieVariables): (MutationRef<DeleteMovieData, DeleteMovieVariables> & { __angular?: false });

export function deleteMovie(vars: DeleteMovieVariables): MutationPromise<DeleteMovieData, DeleteMovieVariables>;
export function deleteMovie(dc: DataConnect, vars: DeleteMovieVariables): MutationPromise<DeleteMovieData, DeleteMovieVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listMoviesRef(): (QueryRef<ListMoviesData, undefined> & { __angular?: false });
/* Allow users to pass in custom DataConnect instances */
export function listMoviesRef(dc: DataConnect): (QueryRef<ListMoviesData, undefined> & { __angular?: false });

export function listMovies(): QueryPromise<ListMoviesData, undefined>;
export function listMovies(dc: DataConnect): QueryPromise<ListMoviesData, undefined>;


/* Allow users to create refs without passing in DataConnect */
export function getMovieByIdRef(vars: GetMovieByIdVariables): (QueryRef<GetMovieByIdData, GetMovieByIdVariables> & { __angular?: false });
/* Allow users to pass in custom DataConnect instances */
export function getMovieByIdRef(dc: DataConnect, vars: GetMovieByIdVariables): (QueryRef<GetMovieByIdData, GetMovieByIdVariables> & { __angular?: false });

export function getMovieById(vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;
export function getMovieById(dc: DataConnect, vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;

