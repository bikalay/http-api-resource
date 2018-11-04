/* @flow */

/**
 * Prepares url
 * @param {string} url - Url string
 * @param {string} method - HTTP Method
 * @param {*} [data] - Request data
 * @returns {string}
 */
export function processUrl(url: string ='', method: string, data: any): string {
  method = method.toLowerCase();
  switch(method) {
    case 'post':
    case 'put':
    case 'patch':
      url = objectToParam(url, data, null, true);
      break;
    default:
      url = objectToParam(url, data);
      break;
  }
  return url.replace(/[\&\?]:[^\&\?]+/g, '')
    .replace(/\/:[^\&\?\/]+/g, '');
}

/**
 *
 * @param {string} url
 * @param {string} key
 * @param value
 * @param skip
 * @returns {string}
 */
export function updateUrl(url: string, key: string, value: any, skip?: boolean): string {
  let processed = skip || false;
  value = paramToString(value);

  const paramRegExp = new RegExp('(\/):'+key+'([\/\&\?]|$)','igm');
  const queryRegExp = new RegExp('[\&\?]:'+key, 'igm');
  let isFirstQueryParameter = !/\?[\w_\$]/.test(url);

  if(paramRegExp.test(url)) {
    url = url.replace(paramRegExp, '$1'+value+'$2');
    processed = true;
  }
  if(queryRegExp.test(url)) {
    url = url.replace(queryRegExp, isFirstQueryParameter ? '?'+key+'='+value : '&'+key+'='+value);
    processed = true;
  }
  if(!processed) {
    url = url + (isFirstQueryParameter ? '?'+key+'='+value : '&'+key+'='+value);
  }
  return url;
}

export function objectToParam(url: string, obj: any, key?: ?string, skip?: boolean): string {
  let fieldNames = Object.keys(obj);
  for(let i=0, length = fieldNames.length; i<length; i++) {
    let fieldName = fieldNames[i];
    let value = obj[fieldName];
    let _key = key ? key+'['+fieldName+']' : fieldName;
    switch(Object.prototype.toString.call(value)) {
      case '[object Object]':
        url = objectToParam(url, value, _key, skip);
        break;
      case '[object Array]':
        for(let j=0; j<value.length; j++) {
          url = updateUrl(url, _key, value[j], skip);
        }
        break;
      default:
        url = updateUrl(url, _key, value, skip);
        break;
    }
  }
  return url;
}

export function paramToString (value: any) {
  switch(Object.prototype.toString.call(value)) {
    case '[object Date]':
      return decodeURIComponent(value.toISOString());
    case '[object Object]':
    case '[object Array]':
      return decodeURIComponent(JSON.stringify(value));
    default:
      return decodeURIComponent(value);
  }
}
