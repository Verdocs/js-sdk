import {Endpoint} from '../HTTP/Transport';

export const getMembers = (organizationId: string) =>
  Endpoint.get(`/organizations/${organizationId}/profiles`).then((r) => r.data);

export const deleteMember = (organizationId: string, profileId: string) =>
  Endpoint.delete(`/organizations/${organizationId}/profiles/${profileId}`).then((r) => r.data);

export const addMemberRole = (organizationId: string, profileId: string, roleId: string) =>
  Endpoint.post(`/organizations/${organizationId}/profiles/${profileId}/roles/${roleId}`).then((r) => r.data);

export const deleteMemberRole = (organizationId: string, profileId: string, roleId: string) =>
  Endpoint.delete(`/organizations/${organizationId}/profiles/${profileId}/roles/${roleId}`).then((r) => r.data);

export const getMemberPlans = (organizationId: string, profileId: string) =>
  Endpoint.get(`/organizations/${organizationId}/profiles/${profileId}/plans`).then((r) => r.data);