/**
 * Verdocs functions are organized into high-level modules that represent the main objects within Verdocs:
 *
 * - Documents - An individual document to be signed. Documents are created from templates.
 * - HTTP - General support functionality for Verdocs' REST endpoints. Typically not used directly.
 * - Organizations - An Organization is a container for user profiles, templates, documents, billing, and other related objects.
 * - Search - Various methods used to retrieve lists of documents and templtes.
 * - Templates - A template for a document containing a PDF file, metadata for signature fields, and other information.
 * - Users - All operations related to authentication and user-related operations.
 * - Utils - General support functions used by the other modules and exported for convenience.
 *
 * @module
 */

export * as Documents from './Documents';
export * as Templates from './Templates';
export * as Organizations from './Organizations';
export * as Search from './Search';
export * as Users from './Users';
export * as Utils from './Utils';
export * from './VerdocsEndpoint';
