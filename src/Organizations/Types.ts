import {TRole} from '../Users/Types';

export interface ICreateApiKeyRequest {
  name: string;
  permission: TApiKeyPermission;
}

export interface IUpdateApiKeyRequest {
  name?: string;
  permission?: TApiKeyPermission;
}

export type TApiKeyPermission = 'personal' | 'global_read' | 'global_write';

export interface ICreateInvitationRequest {
  email: string;
  role: TRole;
}

export type TOrgPermission = 'org:create' | 'org:view' | 'org:update' | 'org:delete' | 'org:transfer' | 'org:list';

export interface ISetWebhookRequest {
  url: string;
  active: boolean;
  events: {
    envelope_created: boolean;
    envelope_completed: boolean;
    envelope_canceled: boolean;

    template_created: boolean;
    template_updated: boolean;
    template_deleted: boolean;
    template_used: boolean;
  };
}
