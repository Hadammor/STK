// User type. Follows product-modules.md §3 User.

export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  initials: string;
  languagePreference: string;
  themePreference: 'light' | 'dark' | 'system';
}
