import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default-connector-v12',
  service: 'tanstack-query-firebase',
  location: 'us-central1'
};

export const createMovieRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMovie', inputVars);
}
createMovieRef.operationName = 'CreateMovie';

export function createMovie(dcOrVars, vars) {
  return executeMutation(createMovieRef(dcOrVars, vars));
}

export const upsertMovieRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMovie', inputVars);
}
upsertMovieRef.operationName = 'UpsertMovie';

export function upsertMovie(dcOrVars, vars) {
  return executeMutation(upsertMovieRef(dcOrVars, vars));
}

export const deleteMovieRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMovie', inputVars);
}
deleteMovieRef.operationName = 'DeleteMovie';

export function deleteMovie(dcOrVars, vars) {
  return executeMutation(deleteMovieRef(dcOrVars, vars));
}

export const addMetaRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddMeta');
}
addMetaRef.operationName = 'AddMeta';

export function addMeta(dc) {
  return executeMutation(addMetaRef(dc));
}

export const deleteMetaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMeta', inputVars);
}
deleteMetaRef.operationName = 'DeleteMeta';

export function deleteMeta(dcOrVars, vars) {
  return executeMutation(deleteMetaRef(dcOrVars, vars));
}

export const listMoviesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMovies');
}
listMoviesRef.operationName = 'ListMovies';

export function listMovies(dc) {
  return executeQuery(listMoviesRef(dc));
}

export const getMovieByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMovieById', inputVars);
}
getMovieByIdRef.operationName = 'GetMovieById';

export function getMovieById(dcOrVars, vars) {
  return executeQuery(getMovieByIdRef(dcOrVars, vars));
}

export const getMetaRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMeta');
}
getMetaRef.operationName = 'GetMeta';

export function getMeta(dc) {
  return executeQuery(getMetaRef(dc));
}

