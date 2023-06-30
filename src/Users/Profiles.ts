import {ICreateProfileRequest, IPermission, IProfile, IRole, ISwitchProfileResponse, IUpdateProfileRequest} from './Types';
import {IGroup} from '../Organizations/Types';
import {VerdocsEndpoint} from '../VerdocsEndpoint';

/**
 * Get the user's available profiles. The current profile will be marked with `current: true`.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const profiles = await Profiles.getProfiles()
 * ```
 */
export const getProfiles = (endpoint: VerdocsEndpoint) =>
  endpoint.api //
    .get<IProfile[]>('/profiles')
    .then((r) => r.data);

/**
 * Get the user's available profiles. The current profile will be marked with `current: true`.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const profiles = await Profiles.getCurrentProfile()
 * ```
 */
export const getCurrentProfile = (endpoint: VerdocsEndpoint) =>
  endpoint.api //
    .get<IProfile[]>('/profiles')
    .then((r) => (r.data || []).find((profile) => profile.current));

/**
 * Get a list of system roles.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const roles = await Profiles.getRoles();
 * ```
 */
export const getRoles = (endpoint: VerdocsEndpoint) =>
  endpoint.api //
    .get<IRole[]>('/roles')
    .then((r) => r.data);

/**
 * Get a list of system roles.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const permissions = await Profiles.getPermissions();
 * ```
 */
export const getPermissions = (endpoint: VerdocsEndpoint) =>
  endpoint.api //
    .get<IPermission[]>('/permissions')
    .then((r: any) => r.data);

/**
 * Create a profile. If the caller does not have a "current" profile set, the new profile will be made current.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const newProfile = await Profiles.createProfile({ first_name: 'FIRST', last_name: 'LAST', email: 'EMAIL' });
 * ```
 */
export const createProfile = (endpoint: VerdocsEndpoint, params: ICreateProfileRequest) =>
  endpoint.api //
    .post<IProfile>('/profiles', params)
    .then((r) => r.data);

/**
 * Get a profile. The caller must have admin access to the given profile.
 * TODO: Add a "public" profile endpoint for public pages
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const profile = await Profiles.getProfile('PROFILEID');
 * ```
 */
export const getProfile = (endpoint: VerdocsEndpoint, profileId: string) =>
  endpoint.api //
    .get<IProfile>(`/profiles/${profileId}`)
    .then((r) => r.data);

/**
 * Get a profile's permissions. The caller must have admin access to the given profile.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const permissions = await Profiles.getProfilePermissions('PROFILEID');
 * ```
 */
export const getProfilePermissions = (endpoint: VerdocsEndpoint, profileId: string) =>
  endpoint.api //
    .get<IPermission[]>(`/profiles/${profileId}/permissions`)
    .then((r) => r.data);

/**
 * Get a profile's groups.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const groups = await Profiles.getProfileGroups('PROFILEID');
 * ```
 */
export const getProfileGroups = (endpoint: VerdocsEndpoint, profileId: string) =>
  endpoint.api //
    .get<IGroup[]>(`/profiles/${profileId}/groups`)
    .then((r) => r.data);

/**
 * Switch the caller's "current" profile. The current profile is used for permissions checking and profile_id field settings
 * for most operations in Verdocs. It is important to select the appropropriate profile before calling other API functions.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const newProfile = await Profiles.switchProfile('PROFILEID');
 * ```
 */
export const switchProfile = (endpoint: VerdocsEndpoint, profileId: string) =>
  endpoint.api //
    .post<ISwitchProfileResponse>(`/profiles/${profileId}/switch`)
    .then((r) => r.data);

/**
 * Update a profile. For future expansion, the profile ID to update is required, but currently this must also be the
 * "current" profile for the caller.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const newProfile = await Profiles.updateProfile('PROFILEID');
 * ```
 */
export const updateProfile = (endpoint: VerdocsEndpoint, profileId: string, params: IUpdateProfileRequest) =>
  endpoint.api //
    .put<IProfile>(`/profiles/${profileId}`, params)
    .then((r) => r.data);

/**
 * Delete a profile. If the requested profile is the caller's curent profile, the next available profile will be selected.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * await Profiles.deleteProfile('PROFILEID');
 * ```
 */
export const deleteProfile = (endpoint: VerdocsEndpoint, profileId: string) =>
  endpoint.api //
    .delete(`/profiles/${profileId}`)
    .then((r) => r.data);

export interface ICreateBusinessAccountRequest {
  orgName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Create a user account and parent organization. This endpoint is for creating a new organization. Users joining an
 * existing organization should be invited, and follow their invitation links/instructions to create their accounts.
 *
 * ```typescript
 * import {Profiles} from '@verdocs/js-sdk/Users';
 *
 * const newAccount = await Profiles.createBusinessAccount({
 *   orgName: 'ORG', email: 'a@b.com', password: '12345678', firstName: 'FIRST', lastName: 'LAST'
 * });
 * ```
 */
export const createBusinessAccount = (endpoint: VerdocsEndpoint, params: ICreateBusinessAccountRequest) =>
  endpoint.api //
    .post<IProfile>('/user/business', params)
    .then((r) => r.data);
