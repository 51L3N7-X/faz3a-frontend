import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Arabic is default
  defaultLocale: 'ar',
  locales: ['ar', 'en'],
  // Hide the default locale from the URL
  localePrefix: 'as-needed'
});

export const config = {
  // Skip all non-content paths
  matcher: ["/((?!_next|api|favicon.ico|images/).*)"],
};
