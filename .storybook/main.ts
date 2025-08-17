import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-controls',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;