/**
 * Predefined tags are needed in order to structure the OpenAI documentation for the
 * Verdocs Developer Documentation. If introducing a new tsdoc `group` value, you must add it to
 * these variables.
 */
const Tag = {
  ORGANIZATIONS: 'Organizations',
  ENVELOPES: 'Envelopes',
  ENVELOPE_DOCUMENTS: 'Envelope Documents',
  SIGNATURES_AND_INITIALS: 'Signatures and Initials',
  API_KEYS: 'API Keys',
  ORGANIZATION_CONTACTS: 'Organization Contacts',
  ORGANIZATION_INVITATIONS: 'Organization Invitations',
  ORGANIZATION_MEMBERS: 'Organization Members',
  WEBHOOKS: 'Webhooks',
  FIELDS: 'Fields',
  ROLES: 'Roles',
  TEMPLATE_DOCUMENTS: 'Template Documents',
  TEMPLATES: 'Templates',
  AUTHENTICATION: 'Authentication',
  PROFILES: 'Profiles',
} as const;

export type Tag = (typeof Tag)[keyof typeof Tag];

export interface OpenAITag {
  name: Tag;
  description: string;
  'x-displayName': Tag;
}

export const PREABLE_TAGS: OpenAITag[] = [
  {
    name: Tag.ORGANIZATIONS,
    description: 'Endpoints for managing organizations',
    'x-displayName': Tag.ORGANIZATIONS,
  },
  {
    name: Tag.ENVELOPES,
    description: 'Endpoints for managing envelopes',
    'x-displayName': Tag.ENVELOPES,
  },
  {
    name: Tag.ENVELOPE_DOCUMENTS,
    description: 'Endpoints for managing envelope documents',
    'x-displayName': Tag.ENVELOPE_DOCUMENTS,
  },
  {
    name: Tag.SIGNATURES_AND_INITIALS,
    description: 'Endpoints for managing signatures and initials',
    'x-displayName': Tag.SIGNATURES_AND_INITIALS,
  },
  {
    name: Tag.API_KEYS,
    description: 'Endpoints for managing api keys',
    'x-displayName': Tag.API_KEYS,
  },
  {
    name: Tag.ORGANIZATION_CONTACTS,
    description: 'Endpoints for managing organization contacts',
    'x-displayName': Tag.ORGANIZATION_CONTACTS,
  },
  {
    name: Tag.ORGANIZATION_INVITATIONS,
    description: 'Endpoints for managing organization invitations',
    'x-displayName': Tag.ORGANIZATION_INVITATIONS,
  },
  {
    name: Tag.ORGANIZATION_MEMBERS,
    description: 'Endpoints for managing organization members',
    'x-displayName': Tag.ORGANIZATION_MEMBERS,
  },
  {
    name: Tag.WEBHOOKS,
    description: 'Endpoints for managing webhooks',
    'x-displayName': Tag.WEBHOOKS,
  },
  {
    name: Tag.FIELDS,
    description: 'Endpoints for managing fields',
    'x-displayName': Tag.FIELDS,
  },
  {
    name: Tag.ROLES,
    description: 'Endpoints for managing roles',
    'x-displayName': Tag.ROLES,
  },
  {
    name: Tag.TEMPLATE_DOCUMENTS,
    description: 'Endpoints for managing template documents',
    'x-displayName': Tag.TEMPLATE_DOCUMENTS,
  },
  {
    name: Tag.TEMPLATES,
    description: 'Endpoints for managing templates',
    'x-displayName': Tag.TEMPLATES,
  },
  {
    name: Tag.AUTHENTICATION,
    description: 'Endpoints for managing authentication',
    'x-displayName': Tag.AUTHENTICATION,
  },
  {
    name: Tag.PROFILES,
    description: 'Endpoints for managing Profiles',
    'x-displayName': Tag.PROFILES,
  },
];
