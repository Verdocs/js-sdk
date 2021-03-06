/**
 * API keys are used to authenticate server-to-server calls. (API keys should **never** be used for client-to-server operations!)
 * To generate a key, either use the Verdocs admin interface and make note of the client_id and client_secret generated, or call
 * createKey as shown below. Then call {@link Users.Auth.authenticateApp} to obtain an access token using the provided ID and
 * secret. Note that server-to-server authentication requests return shorter-lived tokens, so it is important to check the `exp`
 * field and re-authenticate as needed for subsequent calls.
 *
 * API keys may be updated or rotated at any time. Regular rotation is recommended. Rotation will not expire or invalidate
 * existing server-to-server sessions, so it may be done at any time without disrupting your application.
 *
 * @module
 */

import {getEndpoint} from '../HTTP/Transport';
import {IApiKey, IApiKeyWithSecret, ICreateApiKeyRequest, IUpdateApiKeyRequest} from './Types';

/**
 * Get a list of keys for a given organization. The caller must have admin access to the organization.
 *
 * ```typescript
 * import {ApiKeys} from '@verdocs/js-sdk/Organizations';
 *
 * const keys = await ApiKeys.getKeys(ORGID);
 * ```
 */
export const getKeys = (organizationId: string) =>
  getEndpoint()
    .api.get<IApiKey[]>(`/organizations/${organizationId}/api_key`)
    .then((r) => r.data);

/**
 * Create an API key.
 *
 * ```typescript
 * import {ApiKeys} from '@verdocs/js-sdk/Organizations';
 *
 * await ApiKeys.createKey(ORGID, {name: NEWNAME});
 * ```
 */
export const createKey = (organizationId: string, params: ICreateApiKeyRequest) =>
  getEndpoint()
    .api.post<IApiKeyWithSecret>(`/organizations/${organizationId}/api_key`, params)
    .then((r) => r.data);

/**
 * Rotate the secret for an API key. The caller must have admin access to the organization.
 *
 * ```typescript
 * import {ApiKeys} from '@verdocs/js-sdk/Organizations';
 *
 * const {client_secret: newSecret} = await ApiKeys.rotateKey(ORGID, CLIENTID);
 * ```
 */
export const rotateKey = (organizationId: string, clientId: string) =>
  getEndpoint()
    .api.put<IApiKeyWithSecret>(`/organizations/${organizationId}/api_key/${clientId}/rotate`)
    .then((r) => r.data);

/**
 * Update an API key to change its assigned Profile ID or Name.
 *
 * ```typescript
 * import {ApiKeys} from '@verdocs/js-sdk/Organizations';
 *
 * await ApiKeys.updateKey(ORGID, CLIENTID, {name: NEWNAME});
 * ```
 */
export const updateKey = (organizationId: string, clientId: string, params: IUpdateApiKeyRequest) =>
  getEndpoint()
    .api.patch<IApiKey>(`/organizations/${organizationId}/api_key/${clientId}`, params)
    .then((r) => r.data);

/**
 * Delete an API key.
 *
 * ```typescript
 * import {ApiKeys} from '@verdocs/js-sdk/Organizations';
 *
 * await ApiKeys.deleteKey(ORGID, CLIENTID);
 * ```
 */
export const deleteKey = (organizationId: string, clientId: string) =>
  getEndpoint()
    .api.delete(`/organizations/${organizationId}/api_key/${clientId}`)
    .then((r) => r.data);
