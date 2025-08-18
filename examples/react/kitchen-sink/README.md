# TanStack Query Firebase Examples

A comprehensive example application showcasing various TanStack Query Firebase hooks and patterns.

## Features

- **Authentication Examples**: ID token management with `useGetIdTokenQuery`
- **Firestore Examples**: Collection querying with `useCollectionQuery`
- **Real-time Updates**: See how the UI updates when data changes
- **Mutation Integration**: Add/delete operations with proper error handling
- **Loading States**: Proper loading and error state management
- **Query Key Management**: Dynamic query keys based on filters

## Running the Examples

1. Start the Firebase emulators:
   ```bash
   cd ../../../ && firebase emulators:start
   ```

2. In another terminal, run the example app:
   ```bash
   pnpm dev:emulator
   ```

3. Navigate to different examples using the navigation bar:
   - **Home**: Overview of available examples
   - **ID Token Query**: Firebase Authentication token management
   - **Collection Query**: Firestore collection querying with filters

## Key Concepts Demonstrated

- Using `useGetIdTokenQuery` for Firebase Authentication
- Using `useCollectionQuery` with different query configurations
- Combining queries with mutations (`useAddDocumentMutation`, `useDeleteDocumentMutation`)
- Dynamic query keys for filtered results
- Proper TypeScript integration with Firestore data
- React Router for navigation between examples

## File Structure

```
src/
├── components/
│   ├── IdTokenExample.tsx        # Authentication example
│   └── CollectionQueryExample.tsx # Firestore example
├── App.tsx                       # Main app with routing
├── firebase.ts                   # Firebase initialization
├── main.tsx                      # Entry point
└── index.css                     # Tailwind CSS
```

## Technologies Used

- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching
- **Firebase**: Authentication and Firestore
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type safety
