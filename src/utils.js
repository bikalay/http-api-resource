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

export function pathToQueryParam(path: string) {
  const fields = path.split('.');
  let param = fields[0];
  if(fields.length > 1) {
    for (let i = 1; i < fields.length; i++) {
      param = param + '[' + fields[i] + ']';
    }
  }
  return param;
}

export function isFirstQueryParameter(field: string, url: string) {
  const firstQuestionMark = url.indexOf('?');
  const fieldQuestionMark = url.indexOf('?:'+field);
  return firstQuestionMark < 0 || firstQuestionMark === fieldQuestionMark;
}

/**
 *
 * @param {string} url
 * @param {string} key
 * @param {*} value
 * @param {boolean} [skip]
 * @returns {string}
 */
export function updateUrl(url: string, key: string, value: any, skip?: boolean): string {
  let processed = skip || false;
  value = paramToString(value);

  const paramRegExp = new RegExp('(\/):'+key+'([\/\&\?]|$)','igm');
  const queryRegExp = new RegExp('[\&\?]:'+key, 'igm');
  const _isFirstQueryParameter: boolean = isFirstQueryParameter(key, url);

  if(paramRegExp.test(url)) {
    url = url.replace(paramRegExp, '$1'+value+'$2');
    processed = true;
  }
  key = pathToQueryParam(key);
  if(queryRegExp.test(url)) {
    url = url.replace(queryRegExp, _isFirstQueryParameter ? '?'+key+'='+value : '&'+key+'='+value);
    processed = true;
  }
  if(!processed) {
    url = url + (_isFirstQueryParameter ? '?'+key+'='+value : '&'+key+'='+value);
  }
  return url;
}

export function objectToParam(url: string, obj: any, key?: ?string, skip?: boolean): string {
  let fieldNames = Object.keys(obj);
  for(let i=0, length = fieldNames.length; i<length; i++) {
    let fieldName = fieldNames[i];
    let value = obj[fieldName];
    let _key = key ? key+'.'+fieldName : fieldName;
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
