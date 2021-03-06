import {getEndpoint} from '../HTTP/Transport';
import {IReminder, ITemplate} from './Types';

export const createReminder = (templateId: string, params: any) =>
  getEndpoint()
    .api.post<ITemplate>(`/templates/${templateId}/reminder/`, params)
    .then((r) => r.data);

export const getReminder = (templateId: string, reminderId: string) =>
  getEndpoint()
    .api.get<IReminder>(`/templates/${templateId}/reminder/${reminderId}`)
    .then((r) => r.data);

export const editReminder = (templateId: string, reminderId: string) =>
  getEndpoint()
    .api.put<IReminder>(`/templates/${templateId}/reminder/${reminderId}`)
    .then((r) => r.data);

export const deleteReminder = (templateId: string, reminderId: string) =>
  getEndpoint()
    .api.delete(`/templates/${templateId}/reminder/${reminderId}`)
    .then((r) => r.data);
