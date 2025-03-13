# Table of Contents
- [**Overview**](#generated-typescript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListMovies*](#listmovies)
  - [*GetMovieById*](#getmoviebyid)
  - [*GetMeta*](#getmeta)
- [**Mutations**](#mutations)
  - [*CreateMovie*](#createmovie)
  - [*UpsertMovie*](#upsertmovie)
  - [*DeleteMovie*](#deletemovie)
  - [*AddMeta*](#addmeta)
  - [*DeleteMeta*](#deletemeta)

# Generated TypeScript README
This README will guide you through the process of using the generated TypeScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/default-connector` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/default-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```javascript
import { connectDataConnectEmulator, getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/default-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListMovies
You can execute the `ListMovies` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
listMovies(): QueryPromise<ListMoviesData, undefined>;

listMoviesRef(): QueryRef<ListMoviesData, undefined>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
listMovies(dc: DataConnect): QueryPromise<ListMoviesData, undefined>;

listMoviesRef(dc: DataConnect): QueryRef<ListMoviesData, undefined>;
```

### Variables
The `ListMovies` query has no variables.
### Return Type
Recall that executing the `ListMovies` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMoviesData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface ListMoviesData {
  movies: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
  } & Movie_Key)[];
}
```
### Using `ListMovies`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, listMovies } from '@dataconnect/default-connector';

// Call the `listMovies()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMovies();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMovies(dataConnect);

console.log(data.movies);

// Or, you can use the `Promise` API.
listMovies().then((response) => {
  const data = response.data;
  console.log(data.movies);
});
```

### Using `ListMovies`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMoviesRef } from '@dataconnect/default-connector';

// Call the `listMoviesRef()` function to get a reference to the query.
const ref = listMoviesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMoviesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.movies);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.movies);
});
```

## GetMovieById
You can execute the `GetMovieById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
getMovieById(vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;

getMovieByIdRef(vars: GetMovieByIdVariables): QueryRef<GetMovieByIdData, GetMovieByIdVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
getMovieById(dc: DataConnect, vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;

getMovieByIdRef(dc: DataConnect, vars: GetMovieByIdVariables): QueryRef<GetMovieByIdData, GetMovieByIdVariables>;
```

### Variables
The `GetMovieById` query requires an argument of type `GetMovieByIdVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface GetMovieByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetMovieById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMovieByIdData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface GetMovieByIdData {
  movie?: {
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
  } & Movie_Key;
}
```
### Using `GetMovieById`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, getMovieById, GetMovieByIdVariables } from '@dataconnect/default-connector';

// The `GetMovieById` query requires an argument of type `GetMovieByIdVariables`:
const getMovieByIdVars: GetMovieByIdVariables = {
  id: ..., 
};

// Call the `getMovieById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMovieById(getMovieByIdVars);
// Variables can be defined inline as well.
const { data } = await getMovieById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMovieById(dataConnect, getMovieByIdVars);

console.log(data.movie);

// Or, you can use the `Promise` API.
getMovieById(getMovieByIdVars).then((response) => {
  const data = response.data;
  console.log(data.movie);
});
```

### Using `GetMovieById`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMovieByIdRef, GetMovieByIdVariables } from '@dataconnect/default-connector';

// The `GetMovieById` query requires an argument of type `GetMovieByIdVariables`:
const getMovieByIdVars: GetMovieByIdVariables = {
  id: ..., 
};

// Call the `getMovieByIdRef()` function to get a reference to the query.
const ref = getMovieByIdRef(getMovieByIdVars);
// Variables can be defined inline as well.
const ref = getMovieByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMovieByIdRef(dataConnect, getMovieByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.movie);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.movie);
});
```

## GetMeta
You can execute the `GetMeta` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
getMeta(): QueryPromise<GetMetaData, undefined>;

getMetaRef(): QueryRef<GetMetaData, undefined>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```javascript
getMeta(dc: DataConnect): QueryPromise<GetMetaData, undefined>;

getMetaRef(dc: DataConnect): QueryRef<GetMetaData, undefined>;
```

### Variables
The `GetMeta` query has no variables.
### Return Type
Recall that executing the `GetMeta` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMetaData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface GetMetaData {
  ref: ({
    id: UUIDString;
  } & Meta_Key)[];
}
```
### Using `GetMeta`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, getMeta } from '@dataconnect/default-connector';


// Call the `getMeta()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMeta();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMeta(dataConnect);

console.log(data.ref);

// Or, you can use the `Promise` API.
getMeta().then((response) => {
  const data = response.data;
  console.log(data.ref);
});
```

### Using `GetMeta`'s `QueryRef` function

```javascript
import { getDataConnect, DataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMetaRef } from '@dataconnect/default-connector';


// Call the `getMetaRef()` function to get a reference to the query.
const ref = getMetaRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMetaRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.ref);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.ref);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateMovie
You can execute the `CreateMovie` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
createMovie(vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;

createMovieRef(vars: CreateMovieVariables): MutationRef<CreateMovieData, CreateMovieVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
createMovie(dc: DataConnect, vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;

createMovieRef(dc: DataConnect, vars: CreateMovieVariables): MutationRef<CreateMovieData, CreateMovieVariables>;
```

### Variables
The `CreateMovie` mutation requires an argument of type `CreateMovieVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface CreateMovieVariables {
  title: string;
  genre: string;
  imageUrl: string;
}
```
### Return Type
Recall that executing the `CreateMovie` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMovieData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface CreateMovieData {
  movie_insert: Movie_Key;
}
```
### Using `CreateMovie`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, createMovie, CreateMovieVariables } from '@dataconnect/default-connector';
// The `CreateMovie` mutation requires an argument of type `CreateMovieVariables`:
const createMovieVars: CreateMovieVariables = {
  title: ..., 
  genre: ..., 
  imageUrl: ..., 
};

// Call the `createMovie()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMovie(createMovieVars);
// Variables can be defined inline as well.
const { data } = await createMovie({ title: ..., genre: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMovie(dataConnect, createMovieVars);

console.log(data.movie_insert);

// Or, you can use the `Promise` API.
createMovie(createMovieVars).then((response) => {
  const data = response.data;
  console.log(data.movie_insert);
});
```

### Using `CreateMovie`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMovieRef, CreateMovieVariables } from '@dataconnect/default-connector';
// The `CreateMovie` mutation requires an argument of type `CreateMovieVariables`:
const createMovieVars: CreateMovieVariables = {
  title: ..., 
  genre: ..., 
  imageUrl: ..., 
};

// Call the `createMovieRef()` function to get a reference to the mutation.
const ref = createMovieRef(createMovieVars);
// Variables can be defined inline as well.
const ref = createMovieRef({ title: ..., genre: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMovieRef(dataConnect, createMovieVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.movie_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.movie_insert);
});
```

## UpsertMovie
You can execute the `UpsertMovie` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
upsertMovie(vars: UpsertMovieVariables): MutationPromise<UpsertMovieData, UpsertMovieVariables>;

upsertMovieRef(vars: UpsertMovieVariables): MutationRef<UpsertMovieData, UpsertMovieVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
upsertMovie(dc: DataConnect, vars: UpsertMovieVariables): MutationPromise<UpsertMovieData, UpsertMovieVariables>;

upsertMovieRef(dc: DataConnect, vars: UpsertMovieVariables): MutationRef<UpsertMovieData, UpsertMovieVariables>;
```

### Variables
The `UpsertMovie` mutation requires an argument of type `UpsertMovieVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface UpsertMovieVariables {
  id: UUIDString;
  title: string;
  imageUrl: string;
}
```
### Return Type
Recall that executing the `UpsertMovie` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertMovieData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface UpsertMovieData {
  movie_upsert: Movie_Key;
}
```
### Using `UpsertMovie`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertMovie, UpsertMovieVariables } from '@dataconnect/default-connector';
// The `UpsertMovie` mutation requires an argument of type `UpsertMovieVariables`:
const upsertMovieVars: UpsertMovieVariables = {
  id: ..., 
  title: ..., 
  imageUrl: ..., 
};

// Call the `upsertMovie()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertMovie(upsertMovieVars);
// Variables can be defined inline as well.
const { data } = await upsertMovie({ id: ..., title: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertMovie(dataConnect, upsertMovieVars);

console.log(data.movie_upsert);

// Or, you can use the `Promise` API.
upsertMovie(upsertMovieVars).then((response) => {
  const data = response.data;
  console.log(data.movie_upsert);
});
```

### Using `UpsertMovie`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertMovieRef, UpsertMovieVariables } from '@dataconnect/default-connector';
// The `UpsertMovie` mutation requires an argument of type `UpsertMovieVariables`:
const upsertMovieVars: UpsertMovieVariables = {
  id: ..., 
  title: ..., 
  imageUrl: ..., 
};

// Call the `upsertMovieRef()` function to get a reference to the mutation.
const ref = upsertMovieRef(upsertMovieVars);
// Variables can be defined inline as well.
const ref = upsertMovieRef({ id: ..., title: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertMovieRef(dataConnect, upsertMovieVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.movie_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.movie_upsert);
});
```

## DeleteMovie
You can execute the `DeleteMovie` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
deleteMovie(vars: DeleteMovieVariables): MutationPromise<DeleteMovieData, DeleteMovieVariables>;

deleteMovieRef(vars: DeleteMovieVariables): MutationRef<DeleteMovieData, DeleteMovieVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
deleteMovie(dc: DataConnect, vars: DeleteMovieVariables): MutationPromise<DeleteMovieData, DeleteMovieVariables>;

deleteMovieRef(dc: DataConnect, vars: DeleteMovieVariables): MutationRef<DeleteMovieData, DeleteMovieVariables>;
```

### Variables
The `DeleteMovie` mutation requires an argument of type `DeleteMovieVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface DeleteMovieVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteMovie` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteMovieData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface DeleteMovieData {
  movie_delete?: Movie_Key | null;
}
```
### Using `DeleteMovie`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteMovie, DeleteMovieVariables } from '@dataconnect/default-connector';

// The `DeleteMovie` mutation requires an argument of type `DeleteMovieVariables`:
const deleteMovieVars: DeleteMovieVariables = {
  id: ..., 
};

// Call the `deleteMovie()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteMovie(deleteMovieVars);
// Variables can be defined inline as well.
const { data } = await deleteMovie({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteMovie(dataConnect, deleteMovieVars);

console.log(data.movie_delete);

// Or, you can use the `Promise` API.
deleteMovie(deleteMovieVars).then((response) => {
  const data = response.data;
  console.log(data.movie_delete);
});
```

### Using `DeleteMovie`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteMovieRef, DeleteMovieVariables } from '@dataconnect/default-connector';

// The `DeleteMovie` mutation requires an argument of type `DeleteMovieVariables`:
const deleteMovieVars: DeleteMovieVariables = {
  id: ..., 
};

// Call the `deleteMovieRef()` function to get a reference to the mutation.
const ref = deleteMovieRef(deleteMovieVars);
// Variables can be defined inline as well.
const ref = deleteMovieRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteMovieRef(dataConnect, deleteMovieVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.movie_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.movie_delete);
});
```

## AddMeta
You can execute the `AddMeta` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
addMeta(): MutationPromise<AddMetaData, undefined>;

addMetaRef(): MutationRef<AddMetaData, undefined>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
addMeta(dc: DataConnect): MutationPromise<AddMetaData, undefined>;

addMetaRef(dc: DataConnect): MutationRef<AddMetaData, undefined>;
```

### Variables
The `AddMeta` mutation has no variables.
### Return Type
Recall that executing the `AddMeta` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddMetaData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface AddMetaData {
  ref: Meta_Key;
}
```
### Using `AddMeta`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, addMeta } from '@dataconnect/default-connector';


// Call the `addMeta()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addMeta();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addMeta(dataConnect);

console.log(data.ref);

// Or, you can use the `Promise` API.
addMeta().then((response) => {
  const data = response.data;
  console.log(data.ref);
});
```

### Using `AddMeta`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addMetaRef } from '@dataconnect/default-connector';


// Call the `addMetaRef()` function to get a reference to the mutation.
const ref = addMetaRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addMetaRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.ref);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.ref);
});
```

## DeleteMeta
You can execute the `DeleteMeta` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```javascript
deleteMeta(vars: DeleteMetaVariables): MutationPromise<DeleteMetaData, DeleteMetaVariables>;

deleteMetaRef(vars: DeleteMetaVariables): MutationRef<DeleteMetaData, DeleteMetaVariables>;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```javascript
deleteMeta(dc: DataConnect, vars: DeleteMetaVariables): MutationPromise<DeleteMetaData, DeleteMetaVariables>;

deleteMetaRef(dc: DataConnect, vars: DeleteMetaVariables): MutationRef<DeleteMetaData, DeleteMetaVariables>;
```

### Variables
The `DeleteMeta` mutation requires an argument of type `DeleteMetaVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```javascript
export interface DeleteMetaVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteMeta` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteMetaData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```javascript
export interface DeleteMetaData {
  ref?: Meta_Key | null;
}
```
### Using `DeleteMeta`'s action shortcut function

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteMeta, DeleteMetaVariables } from '@dataconnect/default-connector';

// The `DeleteMeta` mutation requires an argument of type `DeleteMetaVariables`:
const deleteMetaVars: DeleteMetaVariables = {
  id: ..., 
};

// Call the `deleteMeta()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteMeta(deleteMetaVars);
// Variables can be defined inline as well.
const { data } = await deleteMeta({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteMeta(dataConnect, deleteMetaVars);

console.log(data.ref);

// Or, you can use the `Promise` API.
deleteMeta(deleteMetaVars).then((response) => {
  const data = response.data;
  console.log(data.ref);
});
```

### Using `DeleteMeta`'s `MutationRef` function

```javascript
import { getDataConnect, DataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteMetaRef, DeleteMetaVariables } from '@dataconnect/default-connector';

// The `DeleteMeta` mutation requires an argument of type `DeleteMetaVariables`:
const deleteMetaVars: DeleteMetaVariables = {
  id: ..., 
};

// Call the `deleteMetaRef()` function to get a reference to the mutation.
const ref = deleteMetaRef(deleteMetaVars);
// Variables can be defined inline as well.
const ref = deleteMetaRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteMetaRef(dataConnect, deleteMetaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.ref);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.ref);
});
```

