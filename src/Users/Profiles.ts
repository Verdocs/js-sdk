import type {IAuthenticateResponse, ICreateAccountRequest, IUpdateProfileRequest} from './Types';
import type {IOrganization, IProfile} from '../Models';
import {VerdocsEndpoint} from '../VerdocsEndpoint';

/**
 * Get the user's available profiles. The current profile will be marked with `current: true`.
 *
 * ```typescript
 * import {getProfiles} from '@verdocs/js-sdk';
 *
 * const profiles = await getProfiles();
 * ```
 */
export const getProfiles = (endpoint: VerdocsEndpoint) =>
  endpoint.api //
    .get<IProfile[]>('/v2/profiles')
    .then((r) => r.data);

/**
 * Get the user's available profiles. The current profile will be marked with `current: true`.
 *
 * ```typescript
 * import {getCurrentProfile} from '@verdocs/js-sdk';
 *
 * const profiles = await getCurrentProfile();
 * ```
 */
export const getCurrentProfile = (endpoint: VerdocsEndpoint) =>
  endpoint.api //
    .get<IProfile[]>('/v2/profiles')
    .then((r) => (r.data || []).find((profile) => profile.current));

/**
 * Get a profile. The caller must have admin access to the given profile.
 * TODO: Add a "public" profile endpoint for public pages
 *
 * ```typescript
 * import {getProfile} from '@verdocs/js-sdk';
 *
 * const profile = await getProfile('PROFILEID');
 * ```
 */
export const getProfile = (endpoint: VerdocsEndpoint, profileId: string) =>
  endpoint.api //
    .get<IProfile>(`/v2/profiles/${profileId}`)
    .then((r) => r.data);

/**
 * Switch the caller's "current" profile. The current profile is used for permissions checking
 * and profile_id field settings for most operations in Verdocs. It is important to select the
 * appropropriate profile before calling other API functions.
 *
 * ```typescript
 * import {switchProfile} from '@verdocs/js-sdk';
 *
 * const newProfile = await switchProfile('PROFILEID');
 * ```
 */
export const switchProfile = (endpoint: VerdocsEndpoint, profileId: string) =>
  endpoint.api //
    .post<IAuthenticateResponse>(`/v2/profiles/${profileId}/switch`)
    .then((r) => r.data);

/**
 * Update a profile. For future expansion, the profile ID to update is required, but currently
 * this must also be the "current" profile for the caller.
 *
 * ```typescript
 * import {updateProfile} from '@verdocs/js-sdk/Users';
 *
 * const newProfile = await updateProfile('PROFILEID');
 * ```
 */
export const updateProfile = (endpoint: VerdocsEndpoint, profileId: string, params: IUpdateProfileRequest) =>
  endpoint.api //
    .patch<IProfile>(`/v2/profiles/${profileId}`, params)
    .then((r) => r.data);

/**
 * Delete a profile. If the requested profile is the caller's curent profile, the next
 * available profile will be selected.
 *
 * ```typescript
 * import {deleteProfile} from '@verdocs/js-sdk';
 *
 * await deleteProfile('PROFILEID');
 * ```
 */
export const deleteProfile = (endpoint: VerdocsEndpoint, profileId: string) =>
  endpoint.api //
    .delete<IAuthenticateResponse | {status: 'OK'; message: 'Your last profile has been deleted. You are now logged out.'}>(
      `/v2/profiles/${profileId}`,
    )
    .then((r) => r.data);

/**
 * Create a new user account. Note that there are two registration paths for creation:
 *   - Get invited to an organization, by an admin or owner of that org.
 *   - Created a new organization. The caller will become the first owner of the new org.
 *
 * This endpoint is for the second path, so an organization name is required. It is NOT
 * required to be unique because it is very common for businesses to have the same names,
 * without conflicting (e.g. "Delta" could be Delta Faucet or Delta Airlines).
 *
 * The new profile will automatically be set as the user's "current" profile, and new
 * session tokens will be returned to the caller. However, the caller's email may not yet
 * be verified. In that case, the caller will not yet be able to call other endpoints in
 * the Verdocs API. The caller will need to check their email for a verification code,
 * which should be submitted via the `verifyEmail` endpoint.
 *
 * ```typescript
 * import {createProfile} from '@verdocs/js-sdk';
 *
 * const newSession = await createProfile({
 *   orgName: 'NEW ORG', email: 'a@b.com', password: '12345678', firstName: 'FIRST', lastName: 'LAST'
 * });
 * ```
 */
export const createProfile = (endpoint: VerdocsEndpoint, params: ICreateAccountRequest) =>
  endpoint.api //
    .post<{profile: IProfile; organization: IOrganization}>('/v2/profiles', params)
    .then((r) => r.data);

/**
 * Update the caller's profile photo. This can only be called for the user's "current" profile.
 *
 * ```typescript
 * import {uploadProfilePhoto} from '@verdocs/js-sdk';
 *
 * await uploadProfilePhoto((VerdocsEndpoint.getDefault(), profileId, file);
 * ```
 */
export const updateProfilePhoto = (
  endpoint: VerdocsEndpoint,
  profileId: string,
  file: File,
  onUploadProgress?: (percent: number, loadedBytes: number, totalBytes: number) => void,
) => {
  const formData = new FormData();
  formData.append('picture', file, file.name);

  return endpoint.api //
    .patch<IProfile>(`/v2/profiles/${profileId}`, formData, {
      timeout: 120000,
      onUploadProgress: (event) => {
        const total = event.total || 1;
        const loaded = event.loaded || 0;
        onUploadProgress?.(Math.floor((loaded * 100) / (total || 1)), loaded, total || 1);
      },
    })
    .then((r) => r.data);
};
