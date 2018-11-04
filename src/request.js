/* @flow */

import EventEmitter from 'events';

export type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type XHRRequestOptions = {
  flags?: {[id: string]: any},
  timeout?: number
};

export class XHRRequest extends EventEmitter {
  _xhr: XMLHttpRequest = new XMLHttpRequest();
  method: HTTPMethods;
  url: string;
  headers: {[id: string]: string};
  options: XHRRequestOptions;
  progress: number;
  total: number;
  constructor(method:HTTPMethods , url:string, headers?:{[id: string]: string} = {}, options?: XHRRequestOptions = {}) {
    super();
    this.method = method;
    this.url = url;
    this.headers = headers;
    this.options = options;
    this.progress = 0;
    this.total = 0;
    this._applyHeaders(this.headers);
    if(this.options.timeout) {
      this._setTimeout(this.options.timeout);
    }
    this._attachEvents();
  }

  _applyHeaders(headers: {[id: string]: string}) {
    const keys = Object.keys(this.headers);
    keys.forEach(key => {
      this._xhr.setRequestHeader(key, headers[key]);
    });
  }

  _setTimeout(timeout: number) {
    this._xhr.timeout = timeout;
  }

  _attachEvents() {
    this._xhr.onreadystatechange = event => {
      if(this._xhr.readyState === this._xhr.DONE) {
        if(this._xhr.status === 200) {
          this.emit('success', event, this);
        } else {
          this.emit('failure', event, this);
        }
      }
    };

    this._xhr.addEventListener('loadstart', (event: ProgressEvent) => {
      this.total = event.total;
      this.progress = event.loaded;
      this.emit('loadstart', event, this);
    });

    this._xhr.addEventListener('progress', (event: ProgressEvent) => {
      this.total = event.total;
      this.progress = event.loaded;
      this.emit('progress', event, this);
    });

    this._xhr.addEventListener('error', (event: Event) => {
      this.emit('error', event, this);
    });

    this._xhr.addEventListener('abort', (event: Event) => {
      this.emit('abort', event, this);
    });
    this._xhr.addEventListener('timeout', (event: Event)=>{
      this.emit('timeout', event, this);
    });
    this._xhr.addEventListener('load', (event: ProgressEvent)=>{
      this.total = event.total;
      this.progress = event.loaded;
      this.emit('load', event, this);
    });
    this._xhr.addEventListener('loadend', (event: ProgressEvent)=>{
      this.total = event.total;
      this.progress = event.loaded;
      this.emit('loadend', event, this);
    });
  }

  open() {
    this._xhr.open(this.method, this.url);
  }

  get readyState (): number {
    return this._xhr.readyState;
  }

  get status (): number {
    return this._xhr.status;
  }

  send(data?: any) {
    return this._xhr.send(data);
  }

  abort() {
    this._xhr.abort();
  }

  equals(request: XHRRequest): boolean {
    if(this.method !== request.method) {
      return false;
    }
    if(this.url !== request.url) {
      return false;
    }
    return true;
  }
}
