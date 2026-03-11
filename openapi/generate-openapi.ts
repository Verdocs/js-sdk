import {writeFileSync} from 'node:fs';
import {distributeBlockTags} from './util';
import {Preamble} from './Preamble';
// @ts-expect-error - This will not exist until the docs are generated
import docsJson from '../docs.json';
import {generateSnippets} from './snippets';
import {IBlockTagContent, Kind} from './types';

interface IEntry {
  children?: IEntry[];
  [key: string]: any;
}

// 1. Reuse some tags from TSDoc (Name->actionId, Summary/Description from comment, @group->tags
// 2. Adds support for root-level apiSuccess results (e.g. body of response is object)
// 3. Support for automatically referencing types exported by TSDoc (beyond String/Object/etc) via '.'
// 4. ApiDoc was archived and is no longer maintained
// 5. Must remove curly braces (confuses TSDoc)

// Supported tags:
// @api {get} /v2/envelopes/:id Get Envelope Details
//
// @apiQuery [{type}] [field=defaultValue] [description]
// @apiParam [{type}] [field=defaultValue] [description]
//
// @apiBody {String} [firstname]       Optional Firstname of the User.
// @apiBody {String} lastname          Mandatory Lastname.
// @apiBody {String} country="DE"      Mandatory with default value "DE".
// @apiBody {Number} [age=18]          Optional Age with default 18.
// @apiBody (Login) {String} pass      Only logged-in users can post this.
//                                     In generated documentation a separate
//                                     "Login" Block will be generated.
// @apiBody {Object} [address]         Optional nested address object.
// @apiBody {String} [address[street]] Optional street and number.
// @apiBody {String} [address[zip]]    Optional zip code.
// @apiBody {String} [address[city]]   Optional city.
//
//
// Addon: Use "." to denote the type of the root object
//
//  * @apiSuccess {Object[]} profiles       List of user profiles.
//  * @apiSuccess {Number}   profiles.age   Users age.
//  * @apiSuccess {String}   profiles.image Avatar-Image.
//
//  * @api {get} /user/:id
//  * @apiSuccess {Boolean} active        Specify if the account is active.
//  * @apiSuccess {Object}  profile       User profile information.
//  * @apiSuccess {Number}  profile.age   Users age.
//  * @apiSuccess {String}  profile.image Avatar-Image.
//
// @apiError UserNotFound The <code>id</code> of the User was not found.
//
// @apiDeprecated [text]
//
// @apiDescription This is the Description.
// It is multiline capable.
//
// Last line of Description.
//
// @apiName name
// @apiGroup name
//
// @apiHeader {String} Authorization Bearer: access_token

export const joinTagContent = (content: IBlockTagContent[]) => content.map((c) => c.text).join('');

export const PATH_REGEX = /\/:([a-zA-Z0-9-_]+)/g;

const processChild = (child: Record<string, any>) => {
  const {name, kind, comment} = child as {name: string; kind: number; comment: any; child: any};
  const summary = comment?.summary?.[0]?.text || '';

  if (kind === Kind.OBJECT_LITERAL) {
    Preamble.components = Preamble.components ?? {};
    Preamble.components.schemas = Preamble.components.schemas ?? {};

    // TODO: Support for any other enum types?
    (Preamble.components.schemas as any)[name] = {
      type: 'string',
      description: (summary || '').trim(),
      enum: child?.type?.types?.map((type: any) => type.value) || [],
    };
    return;
  }

  if (kind === Kind.INTERFACE) {
    Preamble.components = Preamble.components ?? {};
    Preamble.components.schemas = Preamble.components.schemas ?? {};

    const schemaEntry: any = {
      type: 'object',
      description: (summary || '').trim(),
      required: [],
      properties: {},
    };

    child.children.forEach((child: Record<string, any>) => {
      const {name, kind, comment, type} = child;
      if (kind !== Kind.PROPERTY || !comment) {
        return;
      }

      schemaEntry.properties[name] = {
        // TODO
        type: type.name === 'number' ? 'integer' : type.name === 'boolean' ? 'boolean' : 'string',
        description: comment.summary[0].text,
      };

      if (child.flags?.isOptional !== true) {
        schemaEntry.required.push(name);
      }
    });

    (Preamble.components.schemas as any)[name] = schemaEntry;
    return;
  }

  if (kind !== Kind.FUNCTION) {
    return;
  }

  const flatBlockTags = (child.signatures ?? [])
    .map((signature) => {
      return signature?.comment?.blockTags ?? [];
    })
    .flat();

  const {entry, method, path} = distributeBlockTags(flatBlockTags, {name, summary});

  if (path && method) {
    entry['x-codeSamples'] = generateSnippets(method, path, {
      showQuery: entry.parameters.find((p: any) => p.in === 'query'),
      showBody: true,
    });

    (Preamble.paths as any)[path] = (Preamble.paths as any)[path] ?? {};
    (Preamble.paths as any)[path][method] = entry;
  }
};

const processEntry = (child: IEntry) => {
  processChild(child);
  if (child.children) {
    return child.children.map(processEntry);
  }
};

const generateDocs = async () => {
  console.log('Generating docs');
  const docs: IEntry = docsJson as IEntry;
  processEntry(docs);
};

generateDocs()
  .then(() => {
    console.log('Done generating OpenAPI docs');
    writeFileSync('./openapi.json', JSON.stringify(Preamble, null, 2));
    process.exit(0);
  })
  .catch((e) => {
    console.log('Unknown error', e);
    process.exit(-1);
  });
