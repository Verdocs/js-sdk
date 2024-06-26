/**
 * Organizations may contain "Groups" of user profiles, called Members. Groups may have permissions assigned that
 * apply to all Members, making it easy to configure role-based access control (RBAC) within an Organization. Note
 * that permissions are **additive**. A user may be a member of more than one group, and may also have permissions
 * assigned directly. In that case, the user will have the combined set of all permissions inherited from all
 * sources.
 *
 * @module
 */

import {VerdocsEndpoint} from '../VerdocsEndpoint';
import {TPermission} from '../BaseTypes';
import {IGroup} from '../Models';

/**
 * Get a list of groups for a given organization. The caller must have admin access to the organization.
 *
 * ```typescript
 * import {Groups} from '@verdocs/js-sdk/Organizations';
 *
 * const groups = await Groups.getGroups(ORGID);
 * ```
 */
export const getGroups = (endpoint: VerdocsEndpoint, organizationId: string) =>
  endpoint.api //
    .get<IGroup[]>(`/organizations/${organizationId}/groups`)
    .then((r) => r.data);

/**
 * Get a single group by name. Returns a detail record.
 *
 * ```typescript
 * import {Groups} from '@verdocs/js-sdk/Organizations';
 *
 * const groups = await Groups.getGroups(ORGID);
 * ```
 */
export const getGroupByName = (endpoint: VerdocsEndpoint, organizationId: string, name?: string) =>
  endpoint.api //
    .get<IGroup>(`/organizations/${organizationId}/groups`, {params: {name}})
    .then((r) => r.data);

/**
 * Get the details for a group.
 *
 * ```typescript
 * import {Groups} from '@verdocs/js-sdk/Organizations';
 *
 * const groups = await Groups.getGroups(ORGID);
 * ```
 */
export const getGroup = (endpoint: VerdocsEndpoint, organizationId: string, groupId: string) =>
  endpoint.api //
    .get<IGroup>(`/organizations/${organizationId}/groups/${groupId}`)
    .then((r) => r.data);

export const getGroupMembers = (endpoint: VerdocsEndpoint, organizationId: string, groupId: string) =>
  endpoint.api //
    .get(`/organizations/${organizationId}/groups/${groupId}/members`)
    .then((r) => r.data);

export const addGroupMembers = (endpoint: VerdocsEndpoint, organizationId: string, groupId: string, params: any) =>
  endpoint.api //
    .post(`/organizations/${organizationId}/groups/${groupId}/members`, params)
    .then((r) => r.data);

export const deleteGroupMembers = (endpoint: VerdocsEndpoint, organizationId: string, groupId: string, params: any) =>
  endpoint.api //
    .put(`/organizations/${organizationId}/groups/${groupId}/delete_members`, params)
    .then((r) => r.data);

export const addGroupPermission = (endpoint: VerdocsEndpoint, organizationId: string, groupId: string, permission: TPermission) =>
  endpoint.api //
    .post(`/organizations/${organizationId}/groups/${groupId}/permissions/${permission}`, {})
    .then((r) => r.data);

export const deleteGroupPermission = (endpoint: VerdocsEndpoint, organizationId: string, groupId: string, permission: TPermission) =>
  endpoint.api //
    .delete(`/organizations/${organizationId}/groups/${groupId}/permissions/${permission}`)
    .then((r) => r.data);
