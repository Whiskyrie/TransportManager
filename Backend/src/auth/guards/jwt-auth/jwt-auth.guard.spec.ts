import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const reflector = { get: jest.fn() } as any; // Mock Reflector
    expect(new JwtAuthGuard(reflector)).toBeDefined();
  });
});
