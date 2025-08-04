const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default-connector-v12',
  service: 'tanstack-query-firebase',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const listMoviesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMovies');
}
listMoviesRef.operationName = 'ListMovies';
exports.listMoviesRef = listMoviesRef;

exports.listMovies = function listMovies(dc) {
  return executeQuery(listMoviesRef(dc));
};

const getMovieByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMovieById', inputVars);
}
getMovieByIdRef.operationName = 'GetMovieById';
exports.getMovieByIdRef = getMovieByIdRef;

exports.getMovieById = function getMovieById(dcOrVars, vars) {
  return executeQuery(getMovieByIdRef(dcOrVars, vars));
};

const getMetaRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMeta');
}
getMetaRef.operationName = 'GetMeta';
exports.getMetaRef = getMetaRef;

exports.getMeta = function getMeta(dc) {
  return executeQuery(getMetaRef(dc));
};

const createMovieRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMovie', inputVars);
}
createMovieRef.operationName = 'CreateMovie';
exports.createMovieRef = createMovieRef;

exports.createMovie = function createMovie(dcOrVars, vars) {
  return executeMutation(createMovieRef(dcOrVars, vars));
};

const upsertMovieRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMovie', inputVars);
}
upsertMovieRef.operationName = 'UpsertMovie';
exports.upsertMovieRef = upsertMovieRef;

exports.upsertMovie = function upsertMovie(dcOrVars, vars) {
  return executeMutation(upsertMovieRef(dcOrVars, vars));
};

const deleteMovieRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMovie', inputVars);
}
deleteMovieRef.operationName = 'DeleteMovie';
exports.deleteMovieRef = deleteMovieRef;

exports.deleteMovie = function deleteMovie(dcOrVars, vars) {
  return executeMutation(deleteMovieRef(dcOrVars, vars));
};

const addMetaRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddMeta');
}
addMetaRef.operationName = 'AddMeta';
exports.addMetaRef = addMetaRef;

exports.addMeta = function addMeta(dc) {
  return executeMutation(addMetaRef(dc));
};

const deleteMetaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMeta', inputVars);
}
deleteMetaRef.operationName = 'DeleteMeta';
exports.deleteMetaRef = deleteMetaRef;

exports.deleteMeta = function deleteMeta(dcOrVars, vars) {
  return executeMutation(deleteMetaRef(dcOrVars, vars));
};
