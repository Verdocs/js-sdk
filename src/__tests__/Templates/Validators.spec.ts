import {describe, expect, it} from '@jest/globals';
import {extractDomain, isWhitelistedEmail} from '../../Templates';

describe('Validators', () => {
  describe('extractDomain', () => {
    it('should extract the root domain from a URL with protocol', () => {
      let result = extractDomain('http://sub.example.com');
      let expected = 'example.com';
      expect(result).toEqual(expected);

      result = extractDomain('https://sub.example.co.uk');
      expected = 'co.uk'; // per logic, only last two parts
      expect(result).toEqual(expected);

      result = extractDomain('https://deep.sub.domain.example.org');
      expected = 'example.org';
      expect(result).toEqual(expected);
    });

    it('should extract domain from URLs without protocol', () => {
      let result = extractDomain('sub.example.com');
      let expected = 'example.com';
      expect(result).toEqual(expected);

      result = extractDomain('another.deep.example.net');
      expected = 'example.net';
      expect(result).toEqual(expected);
    });

    it('should extract the domain from URLs with ports', () => {
      const result1 = extractDomain('http://test.example.com:8080');
      const expected1 = 'example.com:8080';
      expect(result1).toEqual(expected1);

      const result2 = extractDomain('example.org:3000');
      const expected2 = 'example.org:3000';
      expect(result2).toEqual(expected2);
    });

    it('should handle URLs with query strings and fragments', () => {
      let result = extractDomain('https://sub.example.com/path?foo=bar#section');
      let expected = 'example.com';
      expect(result).toEqual(expected);

      result = extractDomain('example.com/path/to/page?query=1#hash');
      expected = 'example.com';
      expect(result).toEqual(expected);
    });

    it('should return "Invalid Host" on invalid domains', () => {
      const result1 = extractDomain('');
      const expected = 'Invalid Host';
      expect(result1).toEqual(expected);

      const result2 = extractDomain('!@#$%');
      const expected2 = 'Invalid Root Domain';
      expect(result2).toEqual(expected2);

      const result3 = extractDomain('://invalidurl');
      const expected3 = 'Invalid Root Domain';
      expect(result3).toEqual(expected3);
    });

    it('should return "Invalid Host" if no root domain can be extracted', () => {
      const result1 = extractDomain('localhost');
      const expected = 'Invalid Root Domain';
      expect(result1).toEqual(expected);

      const result2 = extractDomain('test');
      expect(result2).toEqual(expected);

      const result = extractDomain('http://localhost:3000');
      expect(result).toEqual(expected);
    });
  });

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
