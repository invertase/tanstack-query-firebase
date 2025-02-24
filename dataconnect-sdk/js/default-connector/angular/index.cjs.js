const { queryRef, executeQuery, mutationRef, executeMutation, DataConnect, validateArgs, CallerSdkTypeEnum } = require('@angular/fire/data-connect');
const { injectDataConnectQuery, injectDataConnectMutation } = require('@tanstack-query-firebase/angular/data-connect');
const { inject, Injector } = require('@angular/core');
const connectorConfig = {
  connector: 'default',
  service: 'tanstack-query-firebase',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

exports.createMovieRef = function createMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_setCallerSdkType' in dcInstance) {
    dcInstance._setCallerSdkType(CallerSdkTypeEnum.AngularGenerated);
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@latest`.');
  }
  return mutationRef(dcInstance, 'CreateMovie', inputVars);
};
exports.createMovie = function createMovie(dcOrVars, vars) {
  return executeMutation(createMovieRef(dcOrVars, vars));
};
exports.injectCreateMovie = function injectCreateMovie(args, injector) {
  return injectDataConnectMutation(CreateMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.upsertMovieRef = function upsertMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_setCallerSdkType' in dcInstance) {
    dcInstance._setCallerSdkType(CallerSdkTypeEnum.AngularGenerated);
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@latest`.');
  }
  return mutationRef(dcInstance, 'UpsertMovie', inputVars);
};
exports.upsertMovie = function upsertMovie(dcOrVars, vars) {
  return executeMutation(upsertMovieRef(dcOrVars, vars));
};
exports.injectUpsertMovie = function injectUpsertMovie(args, injector) {
  return injectDataConnectMutation(UpsertMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.deleteMovieRef = function deleteMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_setCallerSdkType' in dcInstance) {
    dcInstance._setCallerSdkType(CallerSdkTypeEnum.AngularGenerated);
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@latest`.');
  }
  return mutationRef(dcInstance, 'DeleteMovie', inputVars);
};
exports.deleteMovie = function deleteMovie(dcOrVars, vars) {
  return executeMutation(deleteMovieRef(dcOrVars, vars));
};
exports.injectDeleteMovie = function injectDeleteMovie(args, injector) {
  return injectDataConnectMutation(DeleteMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.listMoviesRef = function listMoviesRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  if('_setCallerSdkType' in dcInstance) {
    dcInstance._setCallerSdkType(CallerSdkTypeEnum.AngularGenerated);
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@latest`.');
  }
  return queryRef(dcInstance, 'ListMovies');
};
exports.listMovies = function listMovies(dc) {
  return executeQuery(listMoviesRef(dc));
};
exports.injectListMovies = function injectListMovies(options, injector) {
  const finalInjector = injector || inject(Injector);
  const dc = finalInjector.get(DataConnect);
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  ListMoviesRef(dc),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.getMovieByIdRef = function getMovieByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_setCallerSdkType' in dcInstance) {
    dcInstance._setCallerSdkType(CallerSdkTypeEnum.AngularGenerated);
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@latest`.');
  }
  return queryRef(dcInstance, 'GetMovieById', inputVars);
};
exports.getMovieById = function getMovieById(dcOrVars, vars) {
  return executeQuery(getMovieByIdRef(dcOrVars, vars));
};
exports.injectGetMovieById = function injectGetMovieById(args, options, injector) {
  const finalInjector = injector || inject(Injector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  GetMovieByIdRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

