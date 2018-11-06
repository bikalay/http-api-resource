import { Api } from '../src/api';
import { Resource } from '../src/resource';

test('Create Resource success', () => {
  expect(new Resource(new Api('/api'), '/resourcePath')).toBeDefined();
});
