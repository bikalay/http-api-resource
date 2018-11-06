import { XHRRequest } from '../src/request';
import { XMLHttpRequest } from 'xmlhttprequest';

global.XMLHttpRequest = XMLHttpRequest;

test('Create XHRRequest success', () => {
  expect(new XHRRequest('/apiMethod')).toBeDefined();
});
