import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { UserDetailsDtoMapper } from 'src/modules/user/factories/user-details.dto.mapper';
import { UserDeleter } from 'src/modules/user/delegates/user-deleter';

describe('UserDeleter Class', () => {
  let userDeleter: UserDeleter;

  const mockUserRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockUserDetailsDtoMapper = {
    createFromEntity: jest.fn(),
  };

  const USER_ID = 'uuid-123';

  const userMock = {
    id: USER_ID,
    name: 'Test User',
    email: 'test@example.com',
    streaks: 0,
    lastAccess: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const userDetailsDtoMock = {
    id: USER_ID,
    name: 'Test User',
    email: 'test@example.com',
    streaks: 0,
    lastAccess: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDeleter,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: UserDetailsDtoMapper,
          useValue: mockUserDetailsDtoMapper,
        },
      ],
    }).compile();

    userDeleter = module.get<UserDeleter>(UserDeleter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('It should return the data of the deleted user.', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(userMock);
    mockUserRepository.save.mockResolvedValue(userMock);
    mockUserDetailsDtoMapper.createFromEntity.mockResolvedValue(
      userDetailsDtoMock,
    );

    const result = await userDeleter.deleteUser(USER_ID);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: USER_ID });
    expect(mockUserRepository.save).toHaveBeenCalledWith(userMock);
    expect(mockUserDetailsDtoMapper.createFromEntity).toHaveBeenCalledWith(
      userMock,
    );
    expect(result).toEqual(userDetailsDtoMock);
  });
});
