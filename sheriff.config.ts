import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const config: SheriffConfig = {
  // When a module folder contains an index.ts file, Sheriff assumes that this file is the module’s public API.
  // Because the option enableBarrelLess is set to true, Sheriff does not require barrel files.
  // If a module folder does not contain an index.ts, files in the subfolder 'internal' are considered private,
  // and everything else can be accessed from the outside.
  enableBarrelLess: true,
  modules: {
    'src/app/domains/<domain>': {
      'feature-<name>': ['domain:<domain>', 'type:feature'],
      'ui-<name>': ['domain:<domain>', 'type:ui'],
      'data-<name>': ['domain:<domain>', 'type:data'],
      'util-<name>': ['domain:<domain>', 'type:util'],
      ai: ['domain:<domain>', 'type:ai'],
      ui: ['domain:<domain>', 'type:ui'],
      data: ['domain:<domain>', 'type:data'],
      util: ['domain:<domain>', 'type:util'],
    },
    'src/environments': ['environment'],
    'src/app/testing': ['testing'],
  },
  depRules: {
    root: '*',
    'domain:*': [sameTag, 'domain:shared'],
    'domain:shared': [sameTag, 'domain:shared', 'environment'],
    'type:ai': ['type:feature', 'type:ui', 'type:data', 'type:util'],
    'type:feature': ['type:ui', 'type:data', 'type:util'],
    'type:ui': ['type:data', 'type:util'],
    'type:data': ['type:util'],
    'type:util': ['environment'],
    testing: '*',
    '*': ['testing'],
  },
};
