import {IEnvelope} from './Models';

export type TRequestStatus = 'OK' | 'ERROR';

export type TTemplateSender = 'envelope_creator' | 'template_owner';

export type TTemplateAction =
  | 'create_personal'
  | 'create_org'
  | 'create_public'
  | 'read'
  | 'write'
  | 'delete'
  | 'change_visibility_personal'
  | 'change_visibility_org'
  | 'change_visibility_public';

export type TRecipientAction = 'submit' | 'decline' | 'prepare' | 'update';

export type TEnvelopeStatus = 'complete' | 'pending' | 'in progress' | 'declined' | 'canceled';

export type TRecipientStatus = 'invited' | 'opened' | 'signed' | 'submitted' | 'canceled' | 'pending' | 'declined';

export type TRecipientType = 'signer' | 'cc' | 'approver';

/**
 * Plans provide access to Verdocs product features.
 */
// export type TPlan = 'env:essential' | 'org:standard';

export type TSortTemplateBy = 'created_at' | 'updated_at' | 'name' | 'last_used_at' | 'counter' | 'star_counter';

export type TAccessKeyType = 'email' | 'in_app' | 'in_person_link' | 'sms';

export type TApiKeyPermission = 'personal' | 'global_read' | 'global_write';

/** @deprecated. See envelope.created_at, .updated_at, and .canceled_at. */
export type TDeprecatedHistoryEvent = 'envelope:created' | 'envelope:completed';

export type THistoryEvent =
  | 'recipient:signed'
  | 'recipient:opened'
  | 'recipient:submitted'
  | 'recipient:prepared'
  | 'recipient:claimed'
  | 'recipient:agreed'
  | 'recipient:invited'
  | 'recipient:reminder'
  | 'recipient:delegated'
  | 'recipient:updated_info'
  | 'recipient:declined'
  | 'recipient:kba_verified'
  | 'recipient:kba_failed'
  | 'recipient:id_verified'
  | 'recipient:id_failed'
  | 'recipient:pin_verified'
  | 'recipient:pin_failed'
  | 'invitation:resent'
  | 'envelope:cc'
  | 'envelope:canceled'
  | 'owner:updated_recipient_info'
  | 'owner:get_in_person_link'
  | TDeprecatedHistoryEvent;

export type TEventDetail =
  | 'in_app'
  | 'mail'
  | 'signer'
  | 'sms'
  | 'reminder'
  | 'preparer'
  | 'manual'
  | 'in_person_link'
  | 'guest'
  | 'email'
  | ''
  | string; // Modification events have a string description

export type TEnvelopeUpdateResult = Omit<IEnvelope, 'histories' | 'recipients' | 'certificate' | 'document' | 'fields' | 'profile'>;

export type TFieldType =
  | 'signature'
  | 'initial'
  | 'checkbox'
  | 'radio'
  | 'textbox'
  | 'timestamp'
  | 'date'
  | 'dropdown'
  | 'textarea'
  | 'attachment'
  | 'payment';

export type TWebhookEvent =
  | 'envelope_created'
  | 'envelope_completed'
  | 'envelope_canceled'
  | 'envelope_updated'
  | 'template_created'
  | 'template_updated'
  | 'template_deleted'
  | 'template_used';

export type TTemplateVisibility = 'private' | 'shared' | 'public';
