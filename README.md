# Verdocs JS SDK

> Verdocs SDK for Javascript / Typescript

This SDK provides convenience wrappers for both Browser-based and NodeJS applications to call the Verdocs API, with strong typing and
documentation to help you get started quickly developing for the Verdocs platform.

## Getting Started

First add this module to your project:

    npm install --save @verdocs/js-sdk

or:

    yarn add @verdocs/js-sdk

This package is namespaced into packages that organize API calls into functional groups. A top-level `export *` is provided for simplicity,
but to enable Tree Shaking to do its job, it is recommended that you only import the package required for a given task. For example, to
perform a simple authentication request:

```typescript
import {Auth} from '@verdocs/js-sdk/Auth';
import {Transport} from '@verdocs/js-sdk/HTTP';

const {accessToken} = await Auth.authenticateUser({username: 'MY_USERNAME', password: 'MY_PASSWORD'});
Transport.setAuthToken(accessToken);
```

Once you are authenticated, you can use the rest of the controls and embeds within an app. For instance, to provide a simple PDF
viewer for a document stored within Verdocs:

## Documentation

Verdocs functions are organized into high-level modules that represent the main objects within the platform:

- Documents - An individual document to be signed. Documents are created from templates.
- HTTP - General support functionality for Verdocs' REST endpoints. Typically not used directly.
- Organizations - An Organization is a container for user profiles, templates, documents, billing, and other related objects.
- Templates - A template for a document containing a PDF file, metadata for signature fields, and other information.
- Users - All operations related to authentication and user-related operations.
- Utils - General support functions used by the other modules and exported for convenience.

Please see the [API Docs](https://github.com/Verdocs/js-sdk/tree/main/docs) for details on the functions provided by each module.

## Contributing

To avoid the presence of the `dist/` distribution directory appearing in package imports, when this project is built, this `README.md`
and other support files are copied there. Be sure to run `npm version patch` from THIS directory, but the publish command from within
the `dist` folder.

## HTTP Transport

The underlying transport uses `axios`, a cross-environment (NodeJS vs. Browser) HTTP transport layer. When this SDK is included in a
project, a `Transport` singleton Axios Instance will be created to support the API calls to Verdocs servers. This endpoint's operation
may be configured by importing it. Please see the [Axios Documentation](https://github.com/axios/axios) for more information on the
options available. For example, to override the default API call timeout of 3s:

```typescript
import {Transport} from '@verdocs/js-sdk/Auth/HTTP';

Transport.setTimeout(5000);
```

## Contributing

This repository is actively maintained and supported by [Verdocs](https://verdocs.com/). We welcome community contributions and
suggestions! Please file a pull request with any change requests and we will review them as soon as possible.

## TODO

Currently, we have placeholder tests for a number of functions but had to disable the test suite. See
https://jestjs.io/docs/ecmascript-modules and https://github.com/facebook/jest/issues/10025 for more information. Since we manage our
own transport endpoint, we can probably do this mocking ourselves and eliminate the dependency in the first place.

