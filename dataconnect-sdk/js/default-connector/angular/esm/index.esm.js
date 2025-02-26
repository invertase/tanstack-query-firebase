import { createMovieRef, upsertMovieRef, deleteMovieRef, listMoviesRef, getMovieByIdRef } from '../../';
import { DataConnect, CallerSdkTypeEnum } from '@angular/fire/data-connect';
import { injectDataConnectQuery, injectDataConnectMutation } from '@tanstack-query-firebase/angular/data-connect';
import { inject, Injector } from '@angular/core';
export function injectCreateMovie(args, injector) {
  return injectDataConnectMutation(createMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectUpsertMovie(args, injector) {
  return injectDataConnectMutation(upsertMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectDeleteMovie(args, injector) {
  return injectDataConnectMutation(deleteMovieRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

export function injectListMovies(options, injector) {
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

export function injectGetMovieById(args, options, injector) {
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

