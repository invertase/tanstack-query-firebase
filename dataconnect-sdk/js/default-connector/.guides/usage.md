# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createMovie, upsertMovie, deleteMovie, addMeta, deleteMeta, listMovies, getMovieById, getMeta } from '@dataconnect/default-connector';


// Operation CreateMovie:  For variables, look at type CreateMovieVars in ../index.d.ts
const { data } = await CreateMovie(dataConnect, createMovieVars);

// Operation UpsertMovie:  For variables, look at type UpsertMovieVars in ../index.d.ts
const { data } = await UpsertMovie(dataConnect, upsertMovieVars);

// Operation DeleteMovie:  For variables, look at type DeleteMovieVars in ../index.d.ts
const { data } = await DeleteMovie(dataConnect, deleteMovieVars);

// Operation AddMeta: 
const { data } = await AddMeta(dataConnect);

// Operation DeleteMeta:  For variables, look at type DeleteMetaVars in ../index.d.ts
const { data } = await DeleteMeta(dataConnect, deleteMetaVars);

// Operation ListMovies: 
const { data } = await ListMovies(dataConnect);

// Operation GetMovieById:  For variables, look at type GetMovieByIdVars in ../index.d.ts
const { data } = await GetMovieById(dataConnect, getMovieByIdVars);

// Operation GetMeta: 
const { data } = await GetMeta(dataConnect);


```