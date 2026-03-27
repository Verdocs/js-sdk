import {describe, expect, it} from '@jest/globals';
import {isWhitelistedEmail} from '../../Templates';

describe('Validators', () => {
  describe('isWhitelistedEmail', () => {
    it('should return true for a valid and whitelisted email', () => {
      // Example of non-banned
      expect(isWhitelistedEmail('user@company.com')).toBe(true);
      expect(isWhitelistedEmail('jane.doe@mybiz.org')).toBe(true);
    });

    it('should return false for an invalid email', () => {
      expect(isWhitelistedEmail('not-an-email')).toBe(false);
      expect(isWhitelistedEmail('user@.com')).toBe(false);
      expect(isWhitelistedEmail('user.com')).toBe(false);
      expect(isWhitelistedEmail('user@')).toBe(false);
      expect(isWhitelistedEmail('')).toBe(false);
    });

    it('should return false for a valid email with a banned domain', () => {
      expect(isWhitelistedEmail('someone@gmail.com')).toBe(false);
      expect(isWhitelistedEmail('foo@yahoo.com')).toBe(false);
      expect(isWhitelistedEmail('bar@outlook.com')).toBe(false);
      expect(isWhitelistedEmail('hot@icloud.com')).toBe(false);
      expect(isWhitelistedEmail('alice@zoho.com')).toBe(false);
      expect(isWhitelistedEmail('fast@fastmail.com')).toBe(false);
      expect(isWhitelistedEmail('ivan@yandex.ru')).toBe(false);
    });

    it('should return false if email is undefined', () => {
      // @ts-expect-error testing undefined
      expect(isWhitelistedEmail(undefined)).toBe(false);
    });

    it('should return false if the domain is not present', () => {
      expect(isWhitelistedEmail('novalue')).toBe(false);
      expect(isWhitelistedEmail('novalue@')).toBe(false);
    });

    it('should return true for valid email with non-banned domain (edge cases)', () => {
      expect(isWhitelistedEmail('admin@my-domain.co.uk')).toBe(true);
      expect(isWhitelistedEmail('user@sub.domain.org')).toBe(true);
    });
  });
});
