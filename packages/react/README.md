# @tanstack-query-firebase/react

TanStack Query hooks for Firebase and React.

## Installation

```bash
npm install @tanstack-query-firebase/react
# or
yarn add @tanstack-query-firebase/react
# or
pnpm add @tanstack-query-firebase/react
```

### Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "@tanstack/react-query": "^5",
  "firebase": "^11.3.0"
}
```

## Setup

1. Initialize Firebase in your application:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp({
  // your firebase config
});

export const auth = getAuth(app);
export const firestore = getFirestore(app);
```

2. Set up TanStack Query:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { 
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: { 
      retry: false 
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

## Usage

### Authentication

```typescript
import { 
  useSignInWithEmailAndPasswordMutation,
  useSignOutMutation,
  useCreateUserWithEmailAndPasswordMutation 
} from '@tanstack-query-firebase/react/auth';
import { auth } from './firebase-config';

function AuthComponent() {
  const signInMutation = useSignInWithEmailAndPasswordMutation(auth);
  const signOutMutation = useSignOutMutation(auth);
  const createUserMutation = useCreateUserWithEmailAndPasswordMutation(auth);

  const handleSignIn = () => {
    signInMutation.mutate({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  const handleSignUp = () => {
    createUserMutation.mutate({
      email: 'newuser@example.com',
      password: 'password123'
    });
  };

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <div>
      {signInMutation.isSuccess && (
        <p>Signed in as: {signInMutation.data.user.email}</p>
      )}
      <button onClick={handleSignIn} disabled={signInMutation.isPending}>
        Sign In
      </button>
      <button onClick={handleSignUp} disabled={createUserMutation.isPending}>
        Sign Up
      </button>
      <button onClick={handleSignOut} disabled={signOutMutation.isPending}>
        Sign Out
      </button>
    </div>
  );
}
```

### Firestore Queries

```typescript
import { useDocumentQuery, useCollectionQuery } from '@tanstack-query-firebase/react/firestore';
import { doc, collection, query, where } from 'firebase/firestore';
import { firestore } from './firebase-config';

// Document Query
function UserProfile({ userId }: { userId: string }) {
  const userDoc = doc(firestore, 'users', userId);
  
  const { data, isPending, isError } = useDocumentQuery(userDoc, {
    queryKey: ['user', userId],
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading user</div>;
  
  if (data?.exists()) {
    const userData = data.data();
    return <div>Name: {userData.name}</div>;
  }
  
  return <div>User not found</div>;
}

// Collection Query
function UsersList() {
  const usersCollection = collection(firestore, 'users');
  const activeUsersQuery = query(usersCollection, where('active', '==', true));
  
  const { data, isPending } = useCollectionQuery(activeUsersQuery, {
    queryKey: ['users', 'active'],
  });

  if (isPending) return <div>Loading users...</div>;

  return (
    <ul>
      {data?.docs.map(doc => (
        <li key={doc.id}>{doc.data().name}</li>
      ))}
    </ul>
  );
}
```

### Firestore Mutations

```typescript
import { 
  useSetDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useAddDocumentMutation 
} from '@tanstack-query-firebase/react/firestore';
import { doc, collection } from 'firebase/firestore';
import { firestore } from './firebase-config';

function UserEditor({ userId }: { userId: string }) {
  const userDoc = doc(firestore, 'users', userId);
  const usersCollection = collection(firestore, 'users');
  
  const setMutation = useSetDocumentMutation(userDoc);
  const updateMutation = useUpdateDocumentMutation(userDoc);
  const deleteMutation = useDeleteDocumentMutation(userDoc);
  const addMutation = useAddDocumentMutation(usersCollection);

  const handleCreate = () => {
    addMutation.mutate({
      name: 'New User',
      email: 'newuser@example.com',
      createdAt: new Date()
    });
  };

  const handleUpdate = () => {
    updateMutation.mutate({
      name: 'Updated Name',
      updatedAt: new Date()
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <div>
      <button onClick={handleCreate}>Create User</button>
      <button onClick={handleUpdate}>Update User</button>
      <button onClick={handleDelete}>Delete User</button>
    </div>
  );
}
```

### Data Connect

```typescript
import { useDataConnectQuery, useDataConnectMutation } from '@tanstack-query-firebase/react/data-connect';
import { listMoviesRef, createMovieRef } from './dataconnect-generated';

function MoviesApp() {
  // Query
  const { data, isPending, dataConnectResult } = useDataConnectQuery(
    listMoviesRef()
  );

  // Mutation
  const createMovieMutation = useDataConnectMutation(
    (title: string) => createMovieRef({ title })
  );

  const handleCreateMovie = () => {
    createMovieMutation.mutate('New Movie Title');
  };

  if (isPending) return <div>Loading movies...</div>;

  return (
    <div>
      <h2>Movies</h2>
      <ul>
        {data?.movies.map(movie => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
      <button onClick={handleCreateMovie} disabled={createMovieMutation.isPending}>
        Add Movie
      </button>
      <p>Source: {dataConnectResult?.source}</p>
    </div>
  );
}
```

## Available Hooks

### Authentication
- `useApplyActionCodeMutation`
- `useCheckActionCodeMutation`
- `useConfirmPasswordResetMutation`
- `useCreateUserWithEmailAndPasswordMutation`
- `useDeleteUserMutation`
- `useGetRedirectResultQuery`
- `useReloadMutation`
- `useRevokeAccessTokenMutation`
- `useSendSignInLinkToEmailMutation`
- `useSignInAnonymouslyMutation`
- `useSignInWithCredentialMutation`
- `useSignInWithEmailAndPasswordMutation`
- `useSignOutMutation`
- `useUpdateCurrentUserMutation`
- `useVerifyPasswordResetCodeMutation`

### Firestore
- `useAddDocumentMutation`
- `useClearIndexedDbPersistenceMutation`
- `useCollectionQuery`
- `useDeleteDocumentMutation`
- `useDisableNetworkMutation`
- `useDocumentQuery`
- `useEnableNetworkMutation`
- `useGetAggregateFromServerQuery`
- `useGetCountFromServerQuery`
- `useNamedQuery`
- `useRunTransactionMutation`
- `useSetDocumentMutation`
- `useUpdateDocumentMutation`
- `useWaitForPendingWritesQuery`
- `useWriteBatchCommitMutation`

### Data Connect
- `useDataConnectQuery`
- `useDataConnectMutation`
- `DataConnectQueryClient`

## Advanced Usage

### Custom Query Options

All hooks accept TanStack Query options:

```typescript
const { data } = useDocumentQuery(docRef, {
  queryKey: ['custom', 'key'],
  staleTime: 10 * 60 * 1000, // 10 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
  enabled: !!userId, // Conditional fetching
});
```

### Firestore Source Options

Specify where Firestore should fetch data:

```typescript
const { data } = useDocumentQuery(docRef, {
  firestore: {
    source: 'server' // 'default' | 'server' | 'cache'
  }
});
```

### Optimistic Updates

```typescript
const queryClient = useQueryClient();
const updateMutation = useUpdateDocumentMutation(docRef);

updateMutation.mutate(
  { name: 'New Name' },
  {
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['doc', docRef.id] });
      
      const previousData = queryClient.getQueryData(['doc', docRef.id]);
      
      queryClient.setQueryData(['doc', docRef.id], old => ({
        ...old,
        ...newData
      }));
      
      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['doc', docRef.id], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['doc', docRef.id] });
    }
  }
);
```

## TypeScript

This package is written in TypeScript and provides full type safety:

```typescript
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

interface User extends DocumentData {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const userDoc = doc(firestore, 'users', 'userId').withConverter<User>({
  toFirestore: (user: User) => user,
  fromFirestore: (snapshot: QueryDocumentSnapshot) => snapshot.data() as User,
});

const { data } = useDocumentQuery(userDoc);
// data is typed as DocumentSnapshot<User>
```

## Error Handling

All mutations include typed Firebase errors:

```typescript
const mutation = useSignInWithEmailAndPasswordMutation(auth);

if (mutation.isError) {
  const error = mutation.error;
  
  switch (error.code) {
    case 'auth/user-not-found':
      console.log('User not found');
      break;
    case 'auth/wrong-password':
      console.log('Invalid password');
      break;
    default:
      console.log('An error occurred:', error.message);
  }
}
```

## License

MIT