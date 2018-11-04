/* @flow */

import type { RequestData, RequestInterceptor, ResponseInterceptor } from './interseptors';

import { InterceptorsContainer } from './interseptors';
import { XHRRequest } from './request';

export class Api extends InterceptorsContainer {

  endpoint: string;

  requests: Array<XHRRequest>;

  constructor(endpoint: string) {
    super();
    this.endpoint = endpoint;
  }

  makeRequest(requestData: RequestData, requestInterceptors: Array<RequestInterceptor>, responseInterceptors: Array<ResponseInterceptor>) {
    requestInterceptors = requestInterceptors.concat(this.requestInterceptors);
    responseInterceptors = responseInterceptors.concat(this.responseInterceptors);
    for (let i=0; i< requestInterceptors.length; i++) {
      const interceptor = requestInterceptors[i];
      requestData = interceptor(requestData);
      if (requestData.skipInterceptors) {
        break;
      }
    }
    const {method, url, headers, options, data} = requestData;
    const xhr = new XHRRequest(method, url, headers, options);
    xhr.send(data);
    return xhr;
  }

  cancelAll() {
    for (let i = this.requests.length-1; i>=0; i--) {
      const request = this.requests[i];
      request.abort();
    }
  }
}
