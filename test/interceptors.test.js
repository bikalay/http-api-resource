import { InterceptorsContainer } from '../src/interseptors';

test('Create InterceptorsContainer success', () => {
  expect(new InterceptorsContainer()).toBeDefined();
});
