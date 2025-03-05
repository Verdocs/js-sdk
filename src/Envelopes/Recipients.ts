import {
  IInPersonLinkResponse,
  IUpdateRecipientSubmitParams,
  IUpdateRecipientClaimEnvelope,
  IUpdateRecipientAgreedParams,
  IUpdateRecipientNameParams,
  IUpdateRecipientDeclineParams,
  IUpdateRecipientPrepareParams,
  ISignerTokenResponse,
  TAuthenticateRecipientRequest,
} from './Types';
import {IEnvelope, IRecipient} from '../Models';
import {VerdocsEndpoint} from '../VerdocsEndpoint';
import {TRecipientAuthStep} from '../BaseTypes';

/**
 * Update a recipient's status.
 *
 * @group Recipients
 * @api PUT /envelopes/:envelope_id/recipients/:role_name Update Recipient Status
 * @apiParam string(format:uuid) envelope_id The envelope to operate on.
 * @apiParam string role_name The role to adjust.
 * @apiBody string(enum:'submit'|'decline'|'owner_update'|'update'|'prepare') action The action to take. Adjusts the status, and may also perform other operations.
 * @apiBody string first_name? Ignored unless action is 'owner_update' or 'update'. The new owner's or recipient's first name.
 * @apiBody string last_name? Ignored unless action is 'owner_update' or 'update'. The new owner's or recipient's last name.
 * @apiBody string email? Ignored unless action is 'owner_update'. The new owner's email address.
 * @apiBody boolean agreed? Ignored unless action is 'update'. Set to true to accept the e-signing disclosures.
 * @apiBody array(items:IRecipient) recipients? Ignored unless action is 'prepare'. A list of recipients and their fields to set defaults for.
 * @apiSuccess IRecipient . The updated Recipient.
 */
export const updateRecipient = async (
  endpoint: VerdocsEndpoint,
  envelope_id: string,
  role_name: string,
  params:
    | IUpdateRecipientSubmitParams
    | IUpdateRecipientClaimEnvelope
    | IUpdateRecipientAgreedParams
    | IUpdateRecipientNameParams
    | IUpdateRecipientDeclineParams
    | IUpdateRecipientPrepareParams,
) =>
  endpoint.api //
    .put<IRecipient>(`/envelopes/${envelope_id}/recipients/${role_name}`, params)
    .then((r) => r.data);

/**
 * Submit an envelope (signing is finished). Note that all fields must be valid/completed for this to succeed.
 */
export const envelopeRecipientSubmit = (endpoint: VerdocsEndpoint, envelopeId: string, roleName: string) =>
  updateRecipient(endpoint, envelopeId, roleName, {action: 'submit'});

/**
 * Decline to complete an envelope (signing will not terminated).
 */
export const envelopeRecipientDecline = (endpoint: VerdocsEndpoint, envelopeId: string, roleName: string) =>
  updateRecipient(endpoint, envelopeId, roleName, {action: 'decline'});

/**
 * Claim / change ownership of an envelope. This is a special-case operation only available in certain workflows.
 */
export const envelopeRecipientChangeOwner = (
  endpoint: VerdocsEndpoint,
  envelope_id: string,
  role_name: string,
  email: string,
  first_name: string,
  last_name: string,
) => updateRecipient(endpoint, envelope_id, role_name, {action: 'owner_update', email, first_name, last_name});

/**
 * Agree to electronic signing.
 */
export const envelopeRecipientAgree = (endpoint: VerdocsEndpoint, envelopeId: string, roleName: string, agreed: boolean) =>
  updateRecipient(endpoint, envelopeId, roleName, {action: 'update', agreed});

/**
 * Change a recipient's name.
 */
export const envelopeRecipientUpdateName = (
  endpoint: VerdocsEndpoint,
  envelopeId: string,
  roleName: string,
  first_name: string,
  last_name: string,
) => updateRecipient(endpoint, envelopeId, roleName, {action: 'update', first_name, last_name});

/**
 * Change a recipient's name.
 */
export const envelopeRecipientPrepare = (endpoint: VerdocsEndpoint, envelopeId: string, roleName: string, recipients: IRecipient[]) =>
  updateRecipient(endpoint, envelopeId, roleName, {action: 'prepare', recipients});

/**
 * Begin a signing session for an Envelope. This path requires an invite code, and should generally
 * be called with a NON-default Endpoint to avoid conflicting with any active user session the user
 * may have. To initiate in-person signing by an authenticated user (e.g. self-signing), call
 * getInPersonLink() instead. The response from that call includes both a link for direct signing
 * via a Web browser as well as an in-person access_key. That access_key.key may be used here as well.
 *
 * @group Recipients
 * @api POST /v2/sign/unauth/:envelope_id/:role_name/:key Start Signing Session
 * @apiParam string(format:uuid) envelope_id The envelope to operate on.
 * @apiParam string role_name The role to request.
 * @apiParam string key Access key generated by the envelope creator or email/SMS invite.
 * @apiSuccess ISignerTokenResponse . Signing session token and envelope/recipient metadata.
 */
export const startSigningSession = async (endpoint: VerdocsEndpoint, envelope_id: string, role_name: string, key: string) => {
  return endpoint.api //
    .post<ISignerTokenResponse>(`/v2/sign/unauth/${envelope_id}/${encodeURIComponent(role_name)}/${key}`)
    .then((r) => {
      endpoint.setToken(r.data.access_token, 'signing');
      return r.data;
    });
};

/**
 * Get an in-person signing link. Must be called by the owner/creator of the envelope. The response
 * also includes the raw access key that may be used to directly initiate a signing session (see
 * `startSigningSession`) as well as an access token representing a valid signing session for
 * immediate use in embeds or other applications. Note that in-person signing is considered a
 * lower-security operation than authenticated signing, and the final envelope certificate will
 * reflect this.
 *
 * @group Recipients
 * @api POST /v2/sign/in-person/:envelope_id/:role_name Get In-Person Signing Link
 * @apiParam string(format:uuid) envelope_id The envelope to operate on.
 * @apiParam string role_name The role to request.
 * @apiSuccess IInPersonLinkResponse . Signing session token and envelope/recipient metadata.
 */
export const getInPersonLink = (endpoint: VerdocsEndpoint, envelope_id: string, role_name: string) =>
  endpoint.api //
    .post<IInPersonLinkResponse>(`/v2/sign/in-person/${envelope_id}/${encodeURIComponent(role_name)}`)
    .then((r) => r.data);

/**
 * Verify a recipient within a signing session. All signing sessions use an invite code at a minimum,
 * but many scenarios require more robust verification of recipients, so one or more verification
 * methods may be attached to each recipient. If an authentication method is enabled, the
 * signer must first accept the e-signature disclosures, then complete each verification step
 * before attempting to view/display documents, complete any fields, or submit the envelope.
 * This endpoint should be called to complete each step. If the call fails an error will be
 * thrown.
 *
 * @group Recipients
 * @api POST /v2/sign/verify Verify recipient/signer
 * @apiParam string(enum:'passcode'|'email'|'sms'|'kba'|'id') auth_method The authentication method being completed
 * @apiParam string code? The passcode or OTP entered. Required for passcode, email, and SMS methods.
 * @apiParam boolean resend? For SMS or email methods, set to send a new code.
 * @apiParam boolean first_name? For KBA, the recipient's first name
 * @apiParam boolean last_name? For KBA, the recipient's last name
 * @apiParam boolean address? For KBA, the recipient's address
 * @apiParam boolean city? For KBA, the recipient's city
 * @apiParam boolean state? For KBA, the recipient's state
 * @apiParam boolean zip? For KBA, the recipient's zip code
 * @apiParam boolean ssn_last_4? For KBA, the last 4 digits of the recipient's SSN
 * @apiParam boolean dob? For KBA, the recipient's date of birth
 * @apiParam array(items:IKBAResponse) responses? For KBA, responses to any challenge questions presented
 * @apiSuccess ISignerTokenResponse . Updated signing session.
 */
export const verifySigner = (endpoint: VerdocsEndpoint, params: TAuthenticateRecipientRequest) =>
  endpoint.api //
    .post<ISignerTokenResponse>(`/v2/sign/verify`, params)
    .then((r) => r.data);

/**
 * Send a delegation request.
 */
export const sendDelegate = (endpoint: VerdocsEndpoint, envelopeId: string, roleName: string) =>
  endpoint.api //
    .post<IEnvelope>(`/envelopes/${envelopeId}/recipients/${encodeURIComponent(roleName)}`)
    .then((r) => r.data);

/**
 * Resend a recipient's invitation. NOTE: User interfaces should rate-limit this operation to
 * avoid spamming recipients. Excessive use of this endpoint may result in Verdocs rate-limiting
 * the calling application to prevent abuse. This endpoint will return a 200 OK even if the
 * no_contact flag is set on the envelope (in which case the call will be ignored).
 *
 * @group Recipients
 * @api PUT /v2/envelopes/:envelope_id/recipients/:role_name Resend Invitation
 * @apiParam string(format:uuid) envelope_id The envelope to operate on.
 * @apiParam string role_name The role to operate on.
 * @apiBody string(enum:'resend') action The operation to perform.
 * @apiSuccess string . Success message.
 */
export const resendInvitation = (endpoint: VerdocsEndpoint, envelopeId: string, roleName: string) =>
  endpoint.api //
    .put(`/v2/envelopes/${envelopeId}/recipients/${encodeURIComponent(roleName)}`, {action: 'resend'})
    .then((r) => r.data);
