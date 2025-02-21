import { inject } from '@angular/core';
import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs, DataConnect } from '@angular/fire/data-connect';
import { injectDataConnectQuery, injectDataConnectMutation } from '@tanstack-query-firebase/angular/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'tanstack-query-firebase',
  location: 'us-central1'
};
export function createMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'CreateMovie', inputVars);
}
export function createMovie(dcOrVars, vars) {
  return executeMutation(createMovieRef(dcOrVars, vars));
}

export function injectCreateMovie(args) {
  return injectDataConnectMutation(CreateMovieRef, args);
}

export function upsertMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'UpsertMovie', inputVars);
}
export function upsertMovie(dcOrVars, vars) {
  return executeMutation(upsertMovieRef(dcOrVars, vars));
}

export function injectUpsertMovie(args) {
  return injectDataConnectMutation(UpsertMovieRef, args);
}

export function deleteMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'DeleteMovie', inputVars);
}
export function deleteMovie(dcOrVars, vars) {
  return executeMutation(deleteMovieRef(dcOrVars, vars));
}

export function injectDeleteMovie(args) {
  return injectDataConnectMutation(DeleteMovieRef, args);
}

export function listMoviesRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return queryRef(dcInstance, 'ListMovies');
}
export function listMovies(dc) {
  return executeQuery(listMoviesRef(dc));
}

export function injectListMovies(options) {
  const dc = inject(DataConnect);
  
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  ListMoviesRef(dc),
      ...addOpn
    };
  });
}

export function getMovieByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return queryRef(dcInstance, 'GetMovieById', inputVars);
}
export function getMovieById(dcOrVars, vars) {
  return executeQuery(getMovieByIdRef(dcOrVars, vars));
}

export function injectGetMovieById(args, options) {
  const dc = inject(DataConnect);
  
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  GetMovieByIdRef(dc, varsFactoryFn()),
      ...addOpn
    };
  });
}


