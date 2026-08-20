/** Personal / free + disposable email domains that are NOT accepted as a work email */
export const BLOCKED_EMAIL_DOMAINS = new Set([
  // Free / personal providers
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk', 'ymail.com',
  'rocketmail.com', 'outlook.com', 'hotmail.com', 'hotmail.co.uk', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'gmx.com', 'gmx.net', 'mail.com',
  'proton.me', 'protonmail.com', 'pm.me', 'zoho.com', 'yandex.com', 'yandex.ru',
  'tutanota.com', 'fastmail.com', 'hey.com', 'rediffmail.com', 'hushmail.com',
  // Disposable / temp-mail
  'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'sharklasers.com',
  'trashmail.com', 'yopmail.com', 'temp-mail.org', 'tempmail.com', 'getnada.com',
  'dispostable.com', 'maildrop.cc', 'throwawaymail.com', 'fakeinbox.com', 'mailnesia.com',
  'mintemail.com', 'mohmal.com', 'emailondeck.com', 'spambog.com', 'mailcatch.com',
  'moakt.com', 'discard.email', 'grr.la', 'mvrht.com',
]);

/** True only for a syntactically valid email whose domain is not a personal/disposable provider */
export const isWorkEmail = (email: string): boolean => {
  const value = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
  return !BLOCKED_EMAIL_DOMAINS.has(value.split('@')[1]);
};

