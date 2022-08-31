import {ISigningSession, ISigningSessionRequest} from './Types';
import {decodeAccessTokenBody} from '../Utils/Token';
import {VerdocsEndpoint} from '../VerdocsEndpoint';
import {IFieldSetting} from '../Templates/Types';
import {IProfile} from '../Users/Types';

export type TDocumentStatus = 'complete' | 'pending' | 'in progress' | 'declined' | 'canceled';

export type TRecipientStatus = 'invited' | 'opened' | 'signed' | 'submitted' | 'canceled' | 'pending' | 'declined';

export type TRecipientType = 'signer' | 'cc' | 'approver';

// NOTE: Many of the fields here are undefined unless "summary=true" is included in the search terms
export interface IDocumentsSearchResultEntry {
  id: string;
  canceled_at: string;
  certificate_document_id: string;
  created_at: string;
  envelope_document_id: string;
  histories: IHistory[];
  indexed_at: string;
  name: string;
  no_contact: boolean;
  organization_id: string;
  profile_id: string;
  recipients: IRecipient[];
  reminder_id: string | null;
  status: TDocumentStatus;
  next_recipient: {
    claimed: boolean;
    email: string;
    name: string;
    profile_id: string;
    status: TRecipientStatus;
    type: TRecipientType;
  };
  template_id: string;
  total_count: number;
  updated_at: string;
}

export interface IDocumentsSearchResult {
  page: number;
  total: number;
  result: IDocumentsSearchResultEntry[];
}

export interface IDocumentsSummary {
  action_required: {
    page: number;
    total: number;
    result: IActivityEntry[];
  };
  completed: {
    page: number;
    total: number;
    result: IActivityEntry[];
  };
  waiting_others: {
    page: number;
    total: number;
    result: IActivityEntry[];
  };
}

export interface IRecipient {
  agreed: boolean;
  claimed: boolean;
  created_at: string;
  delegated_to: string | null;
  delegator: boolean;
  email: string;
  envelope_id: string;
  full_name: string;
  in_app_access_key?: string;
  key_used_to_conclude?: string;
  message: string | null;
  phone: string | null;
  profile_id: string;
  role_name: string;
  // The sequence number indicates the order in which recipients act. Note that it is the workflow "level" not the
  // recipient's individual index in the list. There may be multiple recipients with the same sequence. Recipients
  // with the same sequence number may act independently, in parallel to each other (co-signers), as long as all
  // Recipients with an earlier sequence number have completed their tasks.
  sequence: number;
  status: TRecipientStatus;
  type: TRecipientType;
  updated_at: string;
}

export interface IDocumentAsset {
  created_at: string;
  id: string;
  mime: string;
  name: string;
  page_numbers: number;
  updated_at: string;
  url: string;
}

export interface IDocumentField {
  envelope_id: string;
  label: string | null;
  name: string;
  page: number;
  recipient_role: string;
  type: string;
  required: boolean;
  settings?: IFieldSetting;
  // DEPRECATED
  setting?: IFieldSetting;
  validator: string | null;

  // Not sent by the server. Used in the UI to identify prepared fields.
  prepared?: boolean;
}

export interface IDocument {
  id: string;
  created_at: string;
  canceled_at: string;
  envelope_document_id: string;
  certificate_document_id: string | null;
  histories: IHistory[];
  recipients: IRecipient[];
  name: string;
  no_contact: boolean;
  profile_id: string;
  reminder_id: string | null;
  status: TDocumentStatus;
  template_id: string;
  updated_at: string;
  organization_id: string | null;

  certificate?: IDocumentAsset | null;
  document?: IDocumentAsset | null;
  fields?: IDocumentField[];
  profile?: IProfile;
}

export type TDocumentUpdateResult = Omit<IDocument, 'histories' | 'recipients' | 'certificate' | 'document' | 'fields' | 'profile'>;

export interface IActivityEntry {
  id: string;
  name: string;
  canceled_at: string;
  created_at: string;
  updated_at: string;
  profile_id: string;
  status: TDocumentStatus;
  template_id: string;
  recipient: {
    claimed: boolean;
    email: string;
    name: string;
    profile_id: string;
    status: TRecipientStatus;
    type: TRecipientType;
  };
}

export interface IHistory {
  created_at: string;
  envelope_id: string;
  event: IHistoryEvent;
  event_detail: IEventDetail;
  id: string;
  role_name: string;
}

export interface IDocumentSearchOptions {
  rows?: number;
  page?: number;
  sort_by?: 'updated_at' | 'created_at';
  ascending?: boolean;
  is_owner?: boolean;
  is_recipient?: boolean;
  envelope_status: TDocumentStatus[];
  recipient_status: TDocumentStatus[];
}

export type IHistoryEvent = 'recipient:invited' | 'recipient:opened' | 'recipient:agreed' | 'recipient:signed' | 'recipient:submitted';

export type IEventDetail = 'in_app' | 'mail' | 'signer' | '';

/**
 * Get a summary of currently active documents.
 *
 * ```typescript
 * import {Documents} from '@verdocs/js-sdk/Documents';
 *
 * const {action_required, completed, waiting_on_others} = await Documents.getSummary();
 * ```
 */
export const getSummary = async (endpoint: VerdocsEndpoint, page: number) =>
  endpoint.api //
    .post<IDocumentsSummary>('/documents/summary', {page})
    .then((r) => r.data);

/**
 * Search for documents matching various criteria.
 *
 * ```typescript
 * import {Documents} from '@verdocs/js-sdk/Documents';
 *
 * const {result, page, total} = await Documents.search({ ... });
 * ```
 */
export const searchDocuments = async (endpoint: VerdocsEndpoint, params: any) =>
  endpoint.api //
    .post<IDocumentsSearchResult>('/documents/search', params)
    .then((r) => r.data);

export interface ISigningSessionResult {
  recipient: IRecipient;
  session: ISigningSession;
  signerToken: string;
}

/**
 * Get a signing session for a Document.
 */
export const getSigningSession = async (endpoint: VerdocsEndpoint, params: ISigningSessionRequest): Promise<ISigningSessionResult> =>
  endpoint.api //
    .get<IRecipient>(`/documents/${params.documentId}/recipients/${encodeURIComponent(params.roleId)}/invitation/${params.inviteCode}`)
    .then((r) => {
      // Avoiding a jsonwebtoken dependency here - we don't actually need the whole library
      const signerToken = r.headers?.signer_token || '';
      const session = decodeAccessTokenBody(signerToken) as ISigningSession;

      endpoint.setToken(r.headers?.signer_token);

      return {recipient: r.data, session, signerToken};
    });

/**
 * Get the list of recipients for a Document.
 */
export const getDocumentRecipients = async (endpoint: VerdocsEndpoint, documentId: string): Promise<IRecipient[]> =>
  endpoint.api //
    .get<IRecipient[]>(`/documents/${documentId}/recipients`)
    .then((r) => r.data);

/**
 * Get all metadata for a Document.
 */
export const getDocument = async (endpoint: VerdocsEndpoint, documentId: string): Promise<IDocument> =>
  endpoint.api //
    .get<IDocument>(`/documents/${documentId}`)
    .then((r) => r.data);

/**
 * Cancel a Document.
 */
export const cancelDocument = async (endpoint: VerdocsEndpoint, documentId: string): Promise<TDocumentUpdateResult> =>
  endpoint.api //
    .put<IDocument>(`/documents/${documentId}`, {action: 'cancel'})
    .then((r) => r.data);

/**
 * Returns true if the recipient has a pending action. Note that this does not necessarily mean the recipient can act (yet).
 */
export const recipientHasAction = (recipient: IRecipient) => !['submitted', 'canceled', 'declined'].includes(recipient.status);

/**
 * Returns the recipients who still have a pending action. Note that not all of these recipients may be able to act (yet).
 */
export const getRecipientsWithActions = (document: IDocument) => (document?.recipients || []).filter(recipientHasAction);

/**
 * Returns true if the recipient can act.
 */
export const recipientCanAct = (recipient: IRecipient, recipientsWithActions: IRecipient[]) =>
  recipient.sequence === recipientsWithActions?.[0]?.sequence;

/**
 * Returns true if the user can act.
 */
export const userCanAct = (email: string, recipientsWithActions: IRecipient[]) => {
  const recipient = recipientsWithActions.find((r) => r.email === email);
  return recipient && recipient.sequence === recipientsWithActions?.[0]?.sequence;
};

/**
 * Get (binary download) a file attached to a Document.
 */
export const getDocumentFile = async (endpoint: VerdocsEndpoint, documentId: string, envelopeDocumentId: string): Promise<string> =>
  endpoint.api //
    .get<string>(`/documents/${documentId}/envelope_documents/${envelopeDocumentId}?file=true`, {
      responseType: 'arraybuffer',
    })
    .then((r) => Buffer.from(r.data, 'binary').toString('base64'));

/**
 * Update a Document field. Typically called during the signing process as a Recipient fills in fields.
 */
export const updateDocumentField = async (endpoint: VerdocsEndpoint, documentId: string, fieldName: string, value: any) =>
  endpoint.api //
    .put<IFieldSetting>(`/documents/${documentId}/fields/${fieldName}`, value)
    .then((r) => r.data);

/**
 * Update a Document signature field. Signature fields are ID-driven. Call `Document.createSignature()` first to create a
 * signature for a Recipient, then call `Documents.updateDocumentFieldSignature()` to attach it to a field.
 */
export const updateDocumentFieldSignature = async (endpoint: VerdocsEndpoint, documentId: string, fieldName: string, signatureId: string) =>
  endpoint.api //
    .put<IFieldSetting>(`/documents/${documentId}/fields/${fieldName}/signature/${signatureId}`)
    .then((r) => r.data);
