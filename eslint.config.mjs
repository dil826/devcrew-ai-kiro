export default [
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs', 
      '*.config.ts',
      'dist/**',
      'build/**',
      'src/types/**',
      'src/services/**',
      '**/*.ts',
      '**/*.tsx'
    ]
  }
]