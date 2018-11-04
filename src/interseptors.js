/* @flow */

import type { XHRRequestOptions, HTTPMethods } from './request';

export type RequestData = {
  skipInterceptors: boolean,
  method:HTTPMethods,
  url:string,
  headers?:{[id: string]: string},
  options?: XHRRequestOptions,
  data: any
}
export type ResponseData = {
  request: RequestData,
  skipInterceptors: boolean
}
export type ProgressData = {
  request: RequestData,
  skipInterceptors: boolean,
  progress: number,
  total: number,
  status: number,
  readyState: number
}
export type RequestInterceptor = (requestData: RequestData) => RequestData;
export type ResponseInterceptor = (responseData: ResponseData) => ResponseData;
export type ProgressInterceptor = (responseData: ProgressData) => ProgressData;

export class InterceptorsContainer {
  requestInterceptors: Array<RequestInterceptor> = [];
  responseInterceptors: Array<ResponseInterceptor> = [];
  progressInterceptors: Array<ProgressInterceptor> = [];

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }
  addPregressInterceptor(interceptor: ProgressInterceptor): void {
    this.progressInterceptors.push(interceptor);
  }
  removeRequestInterceptor(interceptor: RequestInterceptor): void {
    const index = this.requestInterceptors.indexOf(interceptor);
    if (index > -1) {
      this.requestInterceptors.slice(index, 1);
    }
  }
  removeResponseInterceptor(interceptor: ResponseInterceptor): void {
    const index = this.responseInterceptors.indexOf(interceptor);
    if (index > -1) {
      this.responseInterceptors.slice(index, 1);
    }
  }
  removeProgressInterceptor(interceptor: ProgressInterceptor): void {
    const index = this.progressInterceptors.indexOf(interceptor);
    if (index > -1) {
      this.progressInterceptors.slice(index, 1);
    }
  }
}
