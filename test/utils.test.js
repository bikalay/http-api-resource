import { processUrl, pathToQueryParam,isFirstQueryParameter  } from '../src/utils';

test('pathToQueryParam', () => {
  expect(pathToQueryParam('a.b.c')).toBe('a[b][c]');
  expect(pathToQueryParam('a.b')).toBe('a[b]');
  expect(pathToQueryParam('a')).toBe('a');
});

test('isFirstQueryParameter', () => {
  expect(isFirstQueryParameter('field4', '/?:field4?:field5')).toBe(true);
  expect(isFirstQueryParameter('field5', '/?:field4?:field5')).toBe(false);
  expect(isFirstQueryParameter('field6', '/?:field4?:field5')).toBe(false);
  expect(isFirstQueryParameter('field5', '/')).toBe(true);
});

test('processUrl for get method flat object with number fields', () => {
  expect(processUrl(
    '/api/:field1/:field2/action/:field3/?:field4?:field5',
    'GET',
    {field1: 1, field2: -2, field3: 3, field4: 4, field5: 5, field6: 6}))
    .toBe('/api/1/-2/action/3/?field4=4&field5=5&field6=6');
  expect(processUrl(
    '/api/:field1/:field2/action/:field3/?:field4?:field5',
    'GET',
    {field6: 6, field5: 5, field4: 4, field3: 3, field2: -2, field1: 1}))
    .toBe('/api/1/-2/action/3/?field4=4&field5=5&field6=6');
});

test('processUrl for get method flat object with string fields', () => {
  expect(processUrl('/api/:field1/:field2/action/:field3/?:field4?:field5', 'GET', {field1: 'a', field2: '2', field3: 'test', field4: '', field5: '123'}))
    .toBe('/api/a/2/action/test/?field4=&field5=123');
});

test('processUrl for get method nested object with number fields', () => {
  expect(processUrl(
    '/api/:field1.field6/:field2/action/:field3/?:field4?:field5',
    'GET',
    {field1: {field6:1, field7:7}, field2: 2, field3: 3, field4: 4, field5: 5, field8: 8}))
    .toBe('/api/1/2/action/3/?field4=4&field5=5&field1[field7]=7&field8=8');
});


