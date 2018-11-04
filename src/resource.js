/* @flow */
import { Api } from './api';
import type { HTTPMethods } from './request';

export class Resource {
  api: Api;
  resourcePath: string;

  constructor(api: Api, resourcePath: string) {
    this.api = api;
    this.resourcePath = resourcePath;
  }

  resolvePath (method: HTTPMethods, url: string, data: any) {

  }
}
