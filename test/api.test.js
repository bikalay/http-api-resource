import {Api} from '../src/api';

test('Create api success', () => {
  expect(new Api('/api')).toBeDefined();
});
