const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'tanstack-query-firebase',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

function createMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMovie', inputVars);
}
exports.createMovieRef = createMovieRef;

exports.createMovie = function createMovie(dcOrVars, vars) {
  return executeMutation(createMovieRef(dcOrVars, vars));
};

function upsertMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMovie', inputVars);
}
exports.upsertMovieRef = upsertMovieRef;

exports.upsertMovie = function upsertMovie(dcOrVars, vars) {
  return executeMutation(upsertMovieRef(dcOrVars, vars));
};

function deleteMovieRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMovie', inputVars);
}
exports.deleteMovieRef = deleteMovieRef;

exports.deleteMovie = function deleteMovie(dcOrVars, vars) {
  return executeMutation(deleteMovieRef(dcOrVars, vars));
};

function addMetaRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddMeta');
}
exports.addMetaRef = addMetaRef;

exports.addMeta = function addMeta(dc) {
  return executeMutation(addMetaRef(dc));
};

function deleteMetaRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMeta', inputVars);
}
exports.deleteMetaRef = deleteMetaRef;

exports.deleteMeta = function deleteMeta(dcOrVars, vars) {
  return executeMutation(deleteMetaRef(dcOrVars, vars));
};

function listMoviesRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMovies');
}
exports.listMoviesRef = listMoviesRef;

exports.listMovies = function listMovies(dc) {
  return executeQuery(listMoviesRef(dc));
};

function getMovieByIdRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMovieById', inputVars);
}
exports.getMovieByIdRef = getMovieByIdRef;

exports.getMovieById = function getMovieById(dcOrVars, vars) {
  return executeQuery(getMovieByIdRef(dcOrVars, vars));
};

function getMetaRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMeta');
}
exports.getMetaRef = getMetaRef;

exports.getMeta = function getMeta(dc) {
  return executeQuery(getMetaRef(dc));
};
