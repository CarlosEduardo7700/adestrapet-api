import { Test, TestingModule } from '@nestjs/testing';
import { UserRegister } from 'src/modules/user/delegates/user-register';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { UserFactory } from 'src/modules/user/factories/user.factory';
import { UserDetailsDtoMapper } from 'src/modules/user/factories/user-details.dto.mapper';

describe('UserRegister Class', () => {
  let userRegister: UserRegister;

  const mockUserRepository = {
    save: jest.fn(),
  };

  const mockUserFactory = {
    createFromDto: jest.fn(),
  };

  const mockUserDetailsDtoMapper = {
    createFromEntity: jest.fn(),
  };

  const userMock = {
    id: 'uuid-123',
    name: 'Test User',
    email: 'test@example.com',
    streaks: 0,
    lastAccess: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const registerUserDtoMock = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test',
  };

  const userDetailsDtoMock = {
    id: 'uuid-123',
    name: 'Test User',
    email: 'test@example.com',
    streaks: 0,
    lastAccess: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRegister,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: UserFactory,
          useValue: mockUserFactory,
        },
        {
          provide: UserDetailsDtoMapper,
          useValue: mockUserDetailsDtoMapper,
        },
      ],
    }).compile();

    userRegister = module.get<UserRegister>(UserRegister);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('It should return the data of the registered user.', async () => {
    mockUserFactory.createFromDto.mockResolvedValue(userMock);
    mockUserRepository.save.mockResolvedValue(userMock);
    mockUserDetailsDtoMapper.createFromEntity.mockResolvedValue(
      userDetailsDtoMock,
    );

    const result = await userRegister.resgisterUser(registerUserDtoMock);

    expect(mockUserFactory.createFromDto).toHaveBeenCalledWith(
      registerUserDtoMock,
    );
    expect(mockUserRepository.save).toHaveBeenCalledWith(userMock);
    expect(mockUserDetailsDtoMapper.createFromEntity).toHaveBeenCalledWith(
      userMock,
    );
    expect(result).toEqual(userDetailsDtoMock);
  });
});
