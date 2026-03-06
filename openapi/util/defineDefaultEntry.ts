export interface DefineDefaultEntryProps {
  name: string;
  summary: string;
}

export const defineDefaultEntry = (props: DefineDefaultEntryProps) => {
  const {name, summary} = props;
  return {
    operationId: name,
    summary,
    tags: [],
    parameters: [],
    responses: {
      '200': {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
      // TODO: Although this is a documented approach, (see
      //  https://swagger.io/docs/specification/v3_0/describing-responses/#default-response), this causes
      //  the error "Resolver error at responses.default.content.application/json.schema.$ref Could not
      //  resolve reference: JSON Pointer evaluation failed while evaluating token "Error" against an
      //  ObjectElement" to appear in Swagger Editor Next. The old Swagger Editor is just broken entirely
      //  displaying JSON-format OpenAPI v3.1 specs. Disabling it for now and hard-coding responses.
      //  see https://github.com/swagger-api/swagger-ui/issues/9304
      // default: {
      //   description: 'An error occurred.',
      //   content: {
      //     'application/json': {
      //       schema: {$ref: '#/components/schemas/Error'},
      //     },
      //   },
      // },
      '400': {
        description: 'Request Error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status', 'error'],
              properties: {
                status: {type: 'string', enum: ['ERROR'], description: 'Always set to "ERROR".'},
                error: {type: 'string', description: 'Description of the error that occurred.'},
              },
            },
          },
        },
      },
      '401': {
        description: 'Access Denied',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status', 'error'],
              properties: {
                status: {type: 'string', enum: ['ERROR'], description: 'Always set to "ERROR".'},
                error: {type: 'string', description: 'Description of the error that occurred.'},
              },
            },
          },
        },
      },
      '404': {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status', 'error'],
              properties: {
                status: {type: 'string', enum: ['ERROR'], description: 'Always set to "ERROR".'},
                error: {type: 'string', description: 'Description of the error that occurred.'},
              },
            },
          },
        },
      },
      '406': {
        description: 'Invalid Parameter',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status', 'error'],
              properties: {
                status: {type: 'string', enum: ['ERROR'], description: 'Always set to "ERROR".'},
                error: {type: 'string', description: 'Description of the error that occurred.'},
              },
            },
          },
        },
      },
    },
  };
};
