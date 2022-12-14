/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
import { env } from './src/env/server.mjs';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import withPWA from 'next-pwa';
const runWithPWA = withPWA({
    dest: 'public',
    sw: 'service-worker.js',
    importScripts: ['https://js.pusher.com/beams/service-worker.js'],
});

import withTM from 'next-transpile-modules';
const runWithTM = withTM(['@pusher/push-notifications-web']);

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
    return runWithTM(runWithPWA(config));
}

export default defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
    },
});
