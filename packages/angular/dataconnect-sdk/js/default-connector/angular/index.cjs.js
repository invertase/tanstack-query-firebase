const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('@angular/fire/data-connect');
const { inject } = require('@angular/core');

const genSdkImports = require('../');


const connectorConfig = {
  connector: 'default',
  service: 'tanstack-query-firebase',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

function listMoviesRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return queryRef(dcInstance, 'ListMovies');
}
exports.listMoviesRef = listMoviesRef;
exports.listMovies = function listMovies(dc) {
  return executeQuery(listMoviesRef(dc));
};

exports.injectListMovies = function injectListMovies(options) {
  const dc = inject(DataConnect);
  
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  ListMoviesRef(dc),
      ...addOpn
    };
  });
}






function getMovieByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return queryRef(dcInstance, 'GetMovieById', inputVars);
}
exports.getMovieByIdRef = getMovieByIdRef;
exports.getMovieById = function getMovieById(dcOrVars, vars) {
  return executeQuery(getMovieByIdRef(dcOrVars, vars));
};

exports.injectGetMovieById = function injectGetMovieById(args, options) {
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






function createMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'CreateMovie', inputVars);
}
exports.createMovieRef = createMovieRef;
exports.createMovie = function createMovie(dcOrVars, vars) {
  return executeMutation(createMovieRef(dcOrVars, vars));
};

exports.injectCreateMovie = function injectCreateMovie(args) {
  return injectDataConnectMutation(CreateMovieRef, args);
}






function upsertMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'UpsertMovie', inputVars);
}
exports.upsertMovieRef = upsertMovieRef;
exports.upsertMovie = function upsertMovie(dcOrVars, vars) {
  return executeMutation(upsertMovieRef(dcOrVars, vars));
};

exports.injectUpsertMovie = function injectUpsertMovie(args) {
  return injectDataConnectMutation(UpsertMovieRef, args);
}






function deleteMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'DeleteMovie', inputVars);
}
exports.deleteMovieRef = deleteMovieRef;
exports.deleteMovie = function deleteMovie(dcOrVars, vars) {
  return executeMutation(deleteMovieRef(dcOrVars, vars));
};

exports.injectDeleteMovie = function injectDeleteMovie(args) {
  return injectDataConnectMutation(DeleteMovieRef, args);
}






