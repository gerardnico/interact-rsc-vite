import tseslint from 'typescript-eslint';

export default [
    // Could also use the argument of eslint
    // ie `eslint src`
    {
        ignores: [
            "**/*",
            "!src/",
            "!src/**"
        ]
    },
    ...tseslint.configs.recommended,
    // Base rules for the whole project
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // or 'warn' to keep visibility without failing
            'prefer-const': 'warn',
            'prefer-spread': 'warn',
            // ignoreRestSiblings: avoid warning on `page` or `context` variable in this expression: `{page, context, ...props}: AsideProps`
            '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/no-this-alias': 'warn',
            '@typescript-eslint/no-unsafe-function-type': 'warn',
            '@typescript-eslint/no-require-imports': 'warn',
            '@typescript-eslint/no-empty-object-type': 'warn',
        },
    },

    // The node directory contains code for the cli node
    // It can't use @combostrap otherwise it imports from the package.json
    // and the module is the TypeScript one from src
    // You get this kind of error:
    // ```
    // node:internal/modules/esm/resolve:275
    //     throw new ERR_MODULE_NOT_FOUND(
    //           ^
    //
    // Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/user/code/combostrap/interact/src/interact/config/configSchema.js' imported from /home/user/code/combostrap/interact/src/interact/config/interactConfig.ts
    //     at finalizeResolution (node:internal/modules/esm/resolve:275:11)
    //     at moduleResolve (node:internal/modules/esm/resolve:861:10)
    //     at defaultResolve (node:internal/modules/esm/resolve:985:11)
    //     at #cachedDefaultResolve (node:internal/modules/esm/loader:731:20)
    //     at ModuleLoader.resolve (node:internal/modules/esm/loader:708:38)
    //     at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:310:38)
    //     at ModuleJob._link (node:internal/modules/esm/module_job:182:49) {
    //   code: 'ERR_MODULE_NOT_FOUND',
    //   url: 'file:///home/user/code/combostrap/interact/src/interact/config/configSchema.js'
    // }
    // ```
    {
        files: ['src/core/**/*.ts', 'src/core/**/*.tsx'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['[a-zA-Z]*', '!@combostrap/**'],
                            message: 'src/core may only have relative import modules and no @combostrap/*.',
                        },
                    ],
                },
            ],
        },
    },
];