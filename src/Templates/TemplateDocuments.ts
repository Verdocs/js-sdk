/**
 * A TemplateDocument represents a PDF or other attachment in a Template.
 *
 * @module
 */

import {VerdocsEndpoint} from '../VerdocsEndpoint';
import {ITemplateDocument} from './Types';

/**
 * Get all the Template Documents associated to a particular Template.
 *
 * ```typescript
 * import {TemplateDocument} from '@verdocs/js-sdk/Templates';
 *
 * await TemplateDocument.geTemplateDocuments((VerdocsEndpoint.getDefault(), templateId);
 * ```
 */
export const getTemplateDocuments = (endpoint: VerdocsEndpoint, templateId: string) =>
  endpoint.api //
    .get<ITemplateDocument[]>(`/templates/${templateId}/documents/`)
    .then((r) => r.data);

/**
 * Get a specific Document.
 *
 * ```typescript
 * import {TemplateDocument} from '@verdocs/js-sdk/Templates';
 *
 * await TemplateDocument.geTemplateDocument((VerdocsEndpoint.getDefault(), templateId,documentId);
 * ```
 */
export const getTemplateDocument = (endpoint: VerdocsEndpoint, templateId: string, documentId: string) =>
  endpoint.api //
    .get<ITemplateDocument>(`/templates/${templateId}/documents/${documentId}`)
    .then((r) => r.data);

/**
 * Create a Document for a particular Template.
 *
 * ```typescript
 * import {TemplateDocument} from '@verdocs/js-sdk/Templates';
 *
 * await TemplateDocument.createDocument((VerdocsEndpoint.getDefault(), templateID, params);
 * ```
 */
export const createTemplateDocument = (
  endpoint: VerdocsEndpoint,
  templateId: string,
  file: File,
  onUploadProgress?: (percent: number, loadedBytes: number, totalBytes: number) => void,
) => {
  const formData = new FormData();
  formData.append('document', file, file.name);

  return endpoint.api //
    .post<ITemplateDocument>(`/templates/${templateId}/documents`, formData, {
      timeout: 60000,
      onUploadProgress: (event) => {
        const total = event.total || 1;
        const loaded = event.loaded || 0;
        onUploadProgress?.(Math.floor((loaded * 100) / (total || 1)), loaded, total || 1);
      },
    })
    .then((r) => r.data);
};

/**
 * Delete a specific Document.
 *
 * ```typescript
 * import {TemplateDocument} from '@verdocs/js-sdk/Templates';
 *
 * await TemplateDocument.deleteDocument((VerdocsEndpoint.getDefault(), templateID, documentID);
 * ```
 */
export const deleteTemplateDocument = (endpoint: VerdocsEndpoint, templateId: string, documentId: string) =>
  endpoint.api //
    .delete(`/templates/${templateId}/documents/${documentId}`)
    .then((r) => r.data);

/**
 * Get (binary download) a file attached to a Template. It is important to use this method
 * rather than a direct A HREF or similar link to set the authorization headers for the
 * request.
 */
export const getTemplateDocumentFile = async (endpoint: VerdocsEndpoint, templateId: string, documentId: string) =>
  endpoint.api //
    .get(`/templates/${templateId}/documents/${documentId}?file=true`, {responseType: 'blob'})
    .then((r) => r.data);

/**
 * Get (binary download) a file attached to a Template. It is important to use this method
 * rather than a direct A HREF or similar link to set the authorization headers for the
 * request.
 */
export const getTemplateDocumentThumbnail = async (endpoint: VerdocsEndpoint, templateId: string, documentId: string) =>
  endpoint.api //
    .get(`/templates/${templateId}/documents/${documentId}?thumbnail=true`, {responseType: 'blob'})
    .then((r) => r.data);

/**
 * Get a display URI for a given page in a file attached to a template document. These pages are rendered server-side
 * into PNG resources suitable for display in IMG tags although they may be used elsewhere. Note that these are intended
 * for DISPLAY ONLY, are not legally binding documents, and do not contain any encoded metadata from participants. The
 * original asset may be obtained by calling `getTemplateDocumentFile()` or similar.
 */
export const getTemplateDocumentPageDisplayUri = async (endpoint: VerdocsEndpoint, templateId: string, documentId: string, page: number) =>
  endpoint.api.get<string>(`/templates/${templateId}/documents/${documentId}/pages/${page}/image`).then((r) => r.data);
