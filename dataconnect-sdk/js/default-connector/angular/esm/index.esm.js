import { queryRef, executeQuery, mutationRef, executeMutation, DataConnect, validateArgs, CallerSdkTypeEnum } from '@angular/fire/data-connect';
// import { injectDataConnectQuery, injectDataConnectMutation } from '@tanstack-query-firebase/angular/data-connect';
// import { inject, Injector } from '@angular/core';

export const connectorConfig = {
  connector: 'default',
  service: 'tanstack-query-firebase',
  location: 'us-central1'
};

export function createMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_setCallerSdkType' in dcInstance) {
    dcInstance._setCallerSdkType(CallerSdkTypeEnum.GeneratedAngular);
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@latest`.');
  }
  return mutationRef(dcInstance, 'CreateMovie', inputVars);
}
export function createMovie(dcOrVars, vars) {
  return executeMutation(createMovieRef(dcOrVars, vars));
}
// export function injectCreateMovie(args, injector) {
//   return injectDataConnectMutation(CreateMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
// }

export function upsertMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_setCallerSdkType' in dcInstance) {
    dcInstance._setCallerSdkType(CallerSdkTypeEnum.GeneratedAngular);
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@latest`.');
  }
  return mutationRef(dcInstance, 'UpsertMovie', inputVars);
}
export function upsertMovie(dcOrVars, vars) {
  return executeMutation(upsertMovieRef(dcOrVars, vars));
}
// export function injectUpsertMovie(args, injector) {
//   return injectDataConnectMutation(UpsertMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
// }

export function deleteMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_setCallerSdkType' in dcInstance) {
    dcInstance._setCallerSdkType(CallerSdkTypeEnum.GeneratedAngular);
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@latest`.');
  }
  return mutationRef(dcInstance, 'DeleteMovie', inputVars);
}
export function deleteMovie(dcOrVars, vars) {
  return executeMutation(deleteMovieRef(dcOrVars, vars));
}
// export function injectDeleteMovie(args, injector) {
//   return injectDataConnectMutation(DeleteMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
// }

export function listMoviesRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  if('_setCallerSdkType' in dcInstance) {
    dcInstance._setCallerSdkType(CallerSdkTypeEnum.GeneratedAngular);
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@latest`.');
  }
  return queryRef(dcInstance, 'ListMovies');
}
export function listMovies(dc) {
  return executeQuery(listMoviesRef(dc));
}
// export function injectListMovies(options, injector) {
//   const finalInjector = injector || inject(Injector);
//   const dc = finalInjector.get(DataConnect);
//   return injectDataConnectQuery(() => {
//     const addOpn = options && options();
//     return {
//       queryFn: () =>  ListMoviesRef(dc),
//       ...addOpn
//     };
//   }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
// }

export function getMovieByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_setCallerSdkType' in dcInstance) {
    dcInstance._setCallerSdkType(CallerSdkTypeEnum.GeneratedAngular);
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@latest`.');
  }
  return queryRef(dcInstance, 'GetMovieById', inputVars);
}
export function getMovieById(dcOrVars, vars) {
  return executeQuery(getMovieByIdRef(dcOrVars, vars));
}
// export function injectGetMovieById(args, options, injector) {
//   const finalInjector = injector || inject(Injector);
//   const dc = finalInjector.get(DataConnect);
//   const varsFactoryFn = (typeof args === 'function') ? args : () => args;
//   return injectDataConnectQuery(() => {
//     const addOpn = options && options();
//     return {
//       queryFn: () =>  GetMovieByIdRef(dc, varsFactoryFn()),
//       ...addOpn
//     };
//   }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
// }

