import { UserLoginUseCase } from '@users/application/use-cases/login/user-login.use-case';
import { UserRegisterUseCase } from '@users/application/use-cases/register/user-register.use-case';
import { UserInMemoryRepository } from '@users/infrastructure/user-inmemory.repository';
import { InvalidCredentialsException } from '@users/domain/exceptions/invalid-credentials.exception';
import { UserRole } from '@users/domain/user.entity';

describe('UserLoginUseCase', () => {
  let loginUseCase: UserLoginUseCase;
  let registerUseCase: UserRegisterUseCase;
  let userRepository: UserInMemoryRepository;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    loginUseCase = new UserLoginUseCase(userRepository);
    registerUseCase = new UserRegisterUseCase(userRepository);
  });

  describe('execute', () => {
    beforeEach(async () => {
      // Create a test user
      await registerUseCase.execute({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123',
        role: UserRole.BUYER
      });
    });

    it('should login successfully with correct credentials', async () => {
      const result = await loginUseCase.execute({
        email: 'test@example.com',
        password: 'TestPassword123'
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('token');
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
      expect(result.role).toBe(UserRole.BUYER);
    });

    it('should throw InvalidCredentialsException when email is missing', async () => {
      await expect(
        loginUseCase.execute({
          email: '',
          password: 'TestPassword123'
        })
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should throw InvalidCredentialsException when password is missing', async () => {
      await expect(
        loginUseCase.execute({
          email: 'test@example.com',
          password: ''
        })
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should throw InvalidCredentialsException when email does not exist', async () => {
      await expect(
        loginUseCase.execute({
          email: 'nonexistent@example.com',
          password: 'TestPassword123'
        })
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should throw InvalidCredentialsException when password is wrong', async () => {
      await expect(
        loginUseCase.execute({
          email: 'test@example.com',
          password: 'WrongPassword123'
        })
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should generate a valid JWT token on successful login', async () => {
      const result = await loginUseCase.execute({
        email: 'test@example.com',
        password: 'TestPassword123'
      });

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(result.token.split('.').length).toBe(3); // JWT format
    });

    it('should preserve user information in response', async () => {
      const result = await loginUseCase.execute({
        email: 'test@example.com',
        password: 'TestPassword123'
      });

      expect(result.id).toBeDefined();
      expect(result.name).toBe('Test User');
      expect(result.email).toBe('test@example.com');
      expect(result.role).toBe(UserRole.BUYER);
    });
  });
});
