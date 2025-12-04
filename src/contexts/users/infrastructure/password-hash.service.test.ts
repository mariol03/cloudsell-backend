import { PasswordHashService } from '@users/infrastructure/password-hash.service';

describe('PasswordHashService', () => {
  describe('hash', () => {
    it('should hash a password successfully', async () => {
      const password = 'MySecurePassword123';
      const hash = await PasswordHashService.hash(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).toContain(':'); // Salt:Hash format
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'MySecurePassword123';
      const hash1 = await PasswordHashService.hash(password);
      const hash2 = await PasswordHashService.hash(password);

      expect(hash1).not.toBe(hash2); // Different salts = different hashes
    });

    it('should not store the plain password in the hash', async () => {
      const password = 'SecurePassword123';
      const hash = await PasswordHashService.hash(password);

      expect(hash).not.toContain(password);
    });
  });

  describe('compare', () => {
    it('should return true when password matches hash', async () => {
      const password = 'MyPassword123';
      const hash = await PasswordHashService.hash(password);

      const isMatch = await PasswordHashService.compare(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false when password does not match hash', async () => {
      const password = 'MyPassword123';
      const wrongPassword = 'WrongPassword123';
      const hash = await PasswordHashService.hash(password);

      const isMatch = await PasswordHashService.compare(wrongPassword, hash);
      expect(isMatch).toBe(false);
    });

    it('should be case-sensitive', async () => {
      const password = 'MyPassword123';
      const hash = await PasswordHashService.hash(password);

      const isMatch = await PasswordHashService.compare('mypassword123', hash);
      expect(isMatch).toBe(false);
    });

    it('should handle empty password comparison', async () => {
      const password = 'MyPassword123';
      const hash = await PasswordHashService.hash(password);

      const isMatch = await PasswordHashService.compare('', hash);
      expect(isMatch).toBe(false);
    });

    it('should work with special characters in password', async () => {
      const password = 'P@$$w0rd!#%&123';
      const hash = await PasswordHashService.hash(password);

      const isMatch = await PasswordHashService.compare(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should work with long passwords', async () => {
      const password = 'VeryLongPassword'.repeat(10); // 150+ characters
      const hash = await PasswordHashService.hash(password);

      const isMatch = await PasswordHashService.compare(password, hash);
      expect(isMatch).toBe(true);
    });
  });
});
