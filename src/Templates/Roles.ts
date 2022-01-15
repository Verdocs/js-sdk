import {getEndpoint} from '../HTTP/Transport';
import {ITemplateField, IRole} from './Types';

export const createRole = (templateId: string, params: IRole) =>
  getEndpoint()
    .api.post<IRole>(`/templates/${templateId}/roles/`, params)
    .then((r) => r.data);

export const getRoles = (templateId: string) =>
  getEndpoint()
    .api.get<IRole[]>(`/templates/${templateId}/roles/`)
    .then((r) => r.data);

export const getRole = (templateId: string, roleName: string) =>
  getEndpoint()
    .api.get<IRole>(`/templates/${templateId}/roles/${roleName}`)
    .then((r) => r.data);

export const editRole = (templateId: string, roleName: string, params: IRole) =>
  getEndpoint()
    .api.put<IRole>(`/templates/${templateId}/roles/${roleName}`, params)
    .then((r) => r.data);

export const deleteRole = (templateId: string, roleName: string) =>
  getEndpoint()
    .api.delete(`/templates/${templateId}/roles/${roleName}`)
    .then((r) => r.data);

export const getRoleFields = (templateId: string, roleName: string) =>
  getEndpoint()
    .api.get<ITemplateField[]>(`/templates/${templateId}/roles/${roleName}/fields`)
    .then((r) => r.data);

export const deleteSequence = (templateId: string) =>
  getEndpoint()
    .api.delete<IRole[]>(`/templates/${templateId}/roles/`)
    .then((r) => r.data);
