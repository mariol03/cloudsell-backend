import { UserRegisterUseCase } from '@users/application/use-cases/register/user-register.use-case';
import { UserInMemoryRepository } from '@users/infrastructure/user-inmemory.repository';
import { InvalidUserDataException } from '@users/domain/exceptions/invalid-user-data.exception';
import { EmailAlreadyRegisteredException } from '@users/domain/exceptions/email-already-registered.exception';
import { UserRole } from '@users/domain/user.entity';

describe('UserRegisterUseCase', () => {
  let registerUseCase: UserRegisterUseCase;
  let userRepository: UserInMemoryRepository;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    registerUseCase = new UserRegisterUseCase(userRepository);
  });

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      const result = await registerUseCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePassword123',
        role: UserRole.BUYER
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('token');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.role).toBe(UserRole.BUYER);
    });

    it('should register a seller user', async () => {
      const result = await registerUseCase.execute({
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'SellerPassword123',
        role: UserRole.SELLER
      });

      expect(result.role).toBe(UserRole.SELLER);
    });

    it('should default to BUYER role if not specified', async () => {
      const result = await registerUseCase.execute({
        name: 'Default User',
        email: 'default@example.com',
        password: 'Password123'
      });

      expect(result.role).toBe(UserRole.BUYER);
    });

    it('should throw InvalidUserDataException when name is missing', async () => {
      await expect(
        registerUseCase.execute({
          name: '',
          email: 'test@example.com',
          password: 'Password123'
        })
      ).rejects.toThrow(InvalidUserDataException);
    });

    it('should throw InvalidUserDataException when email is missing', async () => {
      await expect(
        registerUseCase.execute({
          name: 'Test User',
          email: '',
          password: 'Password123'
        })
      ).rejects.toThrow(InvalidUserDataException);
    });

    it('should throw InvalidUserDataException when password is missing', async () => {
      await expect(
        registerUseCase.execute({
          name: 'Test User',
          email: 'test@example.com',
          password: ''
        })
      ).rejects.toThrow(InvalidUserDataException);
    });

    it('should throw InvalidUserDataException when email format is invalid', async () => {
      await expect(
        registerUseCase.execute({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123'
        })
      ).rejects.toThrow(InvalidUserDataException);
    });

    it('should throw InvalidUserDataException when password is too short', async () => {
      await expect(
        registerUseCase.execute({
          name: 'Test User',
          email: 'test@example.com',
          password: '12345'
        })
      ).rejects.toThrow(InvalidUserDataException);
    });

    it('should throw EmailAlreadyRegisteredException when email already exists', async () => {
      await registerUseCase.execute({
        name: 'First User',
        email: 'existing@example.com',
        password: 'Password123'
      });

      await expect(
        registerUseCase.execute({
          name: 'Second User',
          email: 'existing@example.com',
          password: 'AnotherPassword123'
        })
      ).rejects.toThrow(EmailAlreadyRegisteredException);
    });

    it('should generate a valid JWT token', async () => {
      const result = await registerUseCase.execute({
        name: 'Token User',
        email: 'token@example.com',
        password: 'TokenPassword123'
      });

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(result.token.split('.').length).toBe(3); // JWT format: header.payload.signature
    });

    it('should not store plain password', async () => {
      const plainPassword = 'MyPlainPassword123';
      await registerUseCase.execute({
        name: 'Security Test',
        email: 'security@example.com',
        password: plainPassword
      });

      const user = await userRepository.findByEmail('security@example.com');
      expect(user?.password).not.toBe(plainPassword);
      expect(user?.password).toContain(':'); // Salt:Hash format
    });
  });
});
