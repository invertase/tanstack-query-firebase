# @tanstack-query-firebase/angular

`@tanstack-query-firebase/angular` provides angular bindings for Firebase products.

## Install Dependencies

```bash
npm i --save @angular/fire firebase @tanstack-query-firebase/angular
```

## Usage

### Data Connect

In your `app.config.ts`, add `provideTanstack` as a provider and `provideDataConnect` and `provideFirebaseApp`:

```ts
import { initializeApp } from '@angular/fire/app';
import { provideDataConnect, getDataConnect } from '@angular/fire/data-connect';
import { connectorConfig } from '@myorg/movies'; // Replace with your generated package name

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideTanStackQuery(new QueryClient()),
    provideFirebaseApp(() => initializeFirebase({/*paste your config here*/})),
    provideDataConnect(() => {
      const dc = getDataConnect(connectorConfig);
      // Add below to connect to the Data Connect emulator
      // connectDataConnectEmulator(dc, 'localhost', 9399);
      return dc;
    }),
  ],
};
```

#### Calling Queries

```ts
import { injectDataConnectQuery } from '@tanstack-query-firebase/angular';
import { listMoviesRef } from '@myorg/movies/angular';

@Component({
    ...,
    template: `
    <mat-grid-list cols="4" rowHeight="2:0.5">
        @if (query.isPending()) { Loading... } @if (query.error()) { An error
        has occurred: {{ query.error()?.message }}
        } @if (query.data(); as data) { @for (movie of data.movies ; track
        movie.id) {
        <mat-grid-tile>
          <mat-card (click)="remove(movie.id)">
            <mat-card-header>{{ movie.name }}</mat-card-header>
            <mat-card-content>
              <span>{{ movie.synopsis }}</span>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        } @empty { Empty list of movies } }
    </mat-grid-list>
    `
})
export class MovieListComponent {
    public query = injectDataConnectQuery(listMoviesRef())
}
```

#### Adding options

```ts
    ...
    public query = injectDataConnectQuery(listMoviesRef(), () => ({
        enabled: false
    }));
```

#### Calling Mutations

```ts
import { injectDataConnectMutation } from '@tanstack-query-firebase/angular';
import { addMovieRef } from '@myorg/movies/angular';
@Component({
    ...,
    template: `
    ...
    <button
        style="margin: auto; display: block"
        mat-raised-button
        (click)="addGeneratedMovie()"
      >
        Add Random Movie
    </button>
    `
})
export class MovieListComponent {
    public mutation = injectDataConnectQuery(addMovieRef())
    addGeneratedMovie() {
        mutation.mutate({ // Or you can use `mutateAsync`
            name: 'Random Movie ' + this.query.data()?.length,
            genre: 'Some Genre',
            synopsis: 'Random Synopsis',
        });
    }
}
```

##### Adding options

We allow invalidating other related queries by:

```ts
    ...
    public mutation = injectDataConnectQuery(addMovieRef(), () => ({
        invalidate: [listMoviesRef()]
    }))
```

You can also pass in other valid options from [CreateMutationOptions](https://tanstack.com/query/latest/docs/framework/angular/reference/interfaces/createmutationoptions).