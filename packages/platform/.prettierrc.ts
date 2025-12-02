// https://github.com/adonisjs/prettier-config
// @ts-expect-error: package has no types
import adonisPrettierConfig from '@adonisjs/prettier-config';

const config: import('prettier').Config = {
  ...adonisPrettierConfig,
  semi: true,
  trailingComma: 'all',
  arrowParens: 'always',
  quoteProps: 'as-needed',
};

export default config;
