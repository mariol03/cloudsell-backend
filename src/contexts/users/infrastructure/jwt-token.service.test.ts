import { JwtTokenService, JwtTokenPayload } from '@users/infrastructure/jwt-token.service';
import { UserEntity, UserRole } from '@users/domain/user.entity';

describe('JwtTokenService', () => {
  let testUser: UserEntity;

  beforeEach(() => {
    testUser = new UserEntity('John Doe', 'john@example.com', 'hashedPassword123', UserRole.BUYER);
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = JwtTokenService.generateToken(testUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT format: header.payload.signature
    });

    it('should include user information in token payload', () => {
      const token = JwtTokenService.generateToken(testUser);
      const decoded = JwtTokenService.verifyToken(token);

      expect(decoded.id).toBe(testUser.id);
      expect(decoded.email).toBe('john@example.com');
      expect(decoded.role).toBe(UserRole.BUYER);
    });

    it('should generate different tokens for different users', () => {
      const user2 = new UserEntity('Jane Doe', 'jane@example.com', 'hashedPassword456', UserRole.SELLER);

      const token1 = JwtTokenService.generateToken(testUser);
      const token2 = JwtTokenService.generateToken(user2);

      expect(token1).not.toBe(token2);
    });

    it('should include expiration time', () => {
      const token = JwtTokenService.generateToken(testUser);
      const decoded = JwtTokenService.verifyToken(token);

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp! > decoded.iat!).toBe(true); // exp should be after iat
    });

    it('should preserve all user roles', () => {
      const buyerToken = JwtTokenService.generateToken(testUser);
      const buyerDecoded = JwtTokenService.verifyToken(buyerToken);
      expect(buyerDecoded.role).toBe(UserRole.BUYER);

      const sellerUser = new UserEntity('Seller', 'seller@example.com', 'hash', UserRole.SELLER);
      const sellerToken = JwtTokenService.generateToken(sellerUser);
      const sellerDecoded = JwtTokenService.verifyToken(sellerToken);
      expect(sellerDecoded.role).toBe(UserRole.SELLER);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = JwtTokenService.generateToken(testUser);
      const decoded = JwtTokenService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testUser.id);
      expect(decoded.email).toBe('john@example.com');
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        JwtTokenService.verifyToken(invalidToken);
      }).toThrow();
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'malformed';

      expect(() => {
        JwtTokenService.verifyToken(malformedToken);
      }).toThrow();
    });

    it('should return correct payload structure', () => {
      const token = JwtTokenService.generateToken(testUser);
      const decoded = JwtTokenService.verifyToken(token);

      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('role');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });
  });

  describe('token integrity', () => {
    it('should not allow token tampering', () => {
      const token = JwtTokenService.generateToken(testUser);
      const parts = token.split('.');
      
      // Try to modify the payload
      const tamperedToken = parts[0] + '.modified' + parts[1] + '.' + parts[2];

      expect(() => {
        JwtTokenService.verifyToken(tamperedToken);
      }).toThrow();
    });

    it('should not allow adding fake signature', () => {
      const token = JwtTokenService.generateToken(testUser);
      const tamperedToken = token.slice(0, -10) + 'fakesignature';

      expect(() => {
        JwtTokenService.verifyToken(tamperedToken);
      }).toThrow();
    });

    it('should verify token immediately after generation', () => {
      const token = JwtTokenService.generateToken(testUser);
      const decoded = JwtTokenService.verifyToken(token);

      expect(decoded.id).toBe(testUser.id);
    });
  });
});
