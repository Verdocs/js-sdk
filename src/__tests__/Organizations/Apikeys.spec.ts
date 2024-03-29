import {jest} from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';
import {IApiKey, IApiKeyWithSecret} from '../../Organizations/Types';
import {VerdocsEndpoint} from '../../VerdocsEndpoint';
import {ApiKeys} from '../../Organizations';

const MockKey = {
  client_id: 'TEST',
  name: 'TEST',
  profile_id: 'TEST',
  organization_id: 'TEST',
} as IApiKey;

const MockKeyWithSecret = {
  client_id: 'TEST',
  client_secret: 'TEST',
  name: 'TEST',
  profile_id: 'TEST',
  organization_id: 'TEST',
} as IApiKeyWithSecret;

const endpoint = VerdocsEndpoint.getDefault();

it('getKeys should return a list of keys for an organization', async () => {
  const catchFn = jest.fn();
  const thenFn = jest.fn();

  const mock = new MockAdapter(endpoint.api);
  mock.onGet('/organizations/TEST/api_key').reply(200, [MockKeyWithSecret]);

  await ApiKeys.getKeys(endpoint, 'TEST').then(thenFn).catch(catchFn);
  expect(thenFn).toBeCalledWith([MockKeyWithSecret]);
  expect(catchFn).not.toBeCalled();
});

it('createKey should return a newly created key', async () => {
  const catchFn = jest.fn();
  const thenFn = jest.fn();

  const mock = new MockAdapter(endpoint.api);
  mock.onPost('/organizations/TEST/api_key').reply(200, MockKeyWithSecret);

  await ApiKeys.createKey(endpoint, 'TEST', {name: 'TEST', profile_id: 'TEST'}).then(thenFn).catch(catchFn);
  expect(thenFn).toBeCalledWith(MockKeyWithSecret);
  expect(catchFn).not.toBeCalled();
});

it('rotateKey should return an updated key with secret', async () => {
  const catchFn = jest.fn();
  const thenFn = jest.fn();

  const mock = new MockAdapter(endpoint.api);
  mock.onPut('/organizations/TEST/api_key/TEST/rotate').reply(200, MockKeyWithSecret);

  await ApiKeys.rotateKey(endpoint, 'TEST', 'TEST').then(thenFn).catch(catchFn);
  expect(thenFn).toBeCalledWith(MockKeyWithSecret);
  expect(catchFn).not.toBeCalled();
});

it('updateKey should return an updated key without secret', async () => {
  const catchFn = jest.fn();
  const thenFn = jest.fn();

  const mock = new MockAdapter(endpoint.api);
  mock.onPatch('/organizations/TEST/api_key/TEST').reply(200, MockKey);

  await ApiKeys.updateKey(endpoint, 'TEST', 'TEST', {name: 'TEST'}).then(thenFn).catch(catchFn);
  expect(thenFn).toBeCalledWith(MockKey);
  expect(catchFn).not.toBeCalled();
});

it('deleteKey should succeed', async () => {
  const catchFn = jest.fn();
  const thenFn = jest.fn();

  const mock = new MockAdapter(endpoint.api);
  mock.onDelete('/organizations/TEST/api_key/TEST').reply(200);

  await ApiKeys.deleteKey(endpoint, 'TEST', 'TEST').then(thenFn).catch(catchFn);
  expect(thenFn).toBeCalled();
  expect(catchFn).not.toBeCalled();
});
