const { createMovieRef, upsertMovieRef, deleteMovieRef, listMoviesRef, getMovieByIdRef } = require('../');
const { DataConnect, CallerSdkTypeEnum } = require('@angular/fire/data-connect');
const { injectDataConnectQuery, injectDataConnectMutation } = require('@tanstack-query-firebase/angular/data-connect');
const { inject, Injector } = require('@angular/core');

exports.injectCreateMovie = function injectCreateMovie(args, injector) {
  return injectDataConnectMutation(createMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectUpsertMovie = function injectUpsertMovie(args, injector) {
  return injectDataConnectMutation(upsertMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectDeleteMovie = function injectDeleteMovie(args, injector) {
  return injectDataConnectMutation(deleteMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectListMovies = function injectListMovies(options, injector) {
  const finalInjector = injector || inject(Injector);
  const dc = finalInjector.get(DataConnect);
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  listMoviesRef(dc),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectGetMovieById = function injectGetMovieById(args, options, injector) {
  const finalInjector = injector || inject(Injector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  getMovieByIdRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

