import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { UserDetailsDtoMapper } from 'src/modules/user/factories/user-details.dto.mapper';
import { UserReader } from 'src/modules/user/delegates/user-reader';
import { UserListDtoMapper } from 'src/modules/user/factories/user-list.dto.mapper';

describe('UserReader Class', () => {
  let userReader: UserReader;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
  };

  const mockUserDetailsDtoMapper = {
    createFromEntity: jest.fn(),
  };

  const mockUserListDtoMapper = {
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

  const usersMock = [
    {
      id: 'uuid-123',
      name: 'Test User 01',
      email: 'test01@example.com',
      streaks: 0,
      lastAccess: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: 'uuid-456',
      name: 'Test User 02',
      email: 'test02@example.com',
      streaks: 0,
      lastAccess: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  const userDetailsDtoMock = {
    id: USER_ID,
    name: 'Test User',
    email: 'test@example.com',
    streaks: 0,
    lastAccess: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const userListDtoMock = [
    {
      id: 'uuid-123',
      name: 'Test User 01',
      email: 'test01@example.com',
      streaks: 0,
      lastAccess: new Date(),
    },
    {
      id: 'uuid-456',
      name: 'Test User 02',
      email: 'test02@example.com',
      streaks: 0,
      lastAccess: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserReader,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: UserDetailsDtoMapper,
          useValue: mockUserDetailsDtoMapper,
        },
        {
          provide: UserListDtoMapper,
          useValue: mockUserListDtoMapper,
        },
      ],
    }).compile();

    userReader = module.get<UserReader>(UserReader);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('It should return a list of users on the first page, with a limit of 2 results.', async () => {
    const expectedSkip = 0;
    const expectedTake = 2;
    mockUserRepository.findAndCount.mockResolvedValue([usersMock]);
    mockUserListDtoMapper.createFromEntity.mockResolvedValue(userListDtoMock);

    const result = await userReader.getUsers(1, 2);

    expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
      take: expectedTake,
      skip: expectedSkip,
      order: {
        updatedAt: 'DESC',
      },
    });
    expect(mockUserListDtoMapper.createFromEntity).toHaveBeenCalledWith(
      usersMock,
    );
    expect(result).toEqual(userListDtoMock);
  });

  test('It should retrieve the data of the user by their ID.', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(userMock);
    mockUserDetailsDtoMapper.createFromEntity.mockResolvedValue(
      userDetailsDtoMock,
    );

    const result = await userReader.getUserById(USER_ID);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
      id: USER_ID,
    });
    expect(mockUserDetailsDtoMapper.createFromEntity).toHaveBeenCalledWith(
      userMock,
    );
    expect(result).toEqual(userDetailsDtoMock);
  });

  test('It should throw an error if the user is not found.', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);

    await expect(userReader.getUserById(USER_ID)).rejects.toThrow(
      `Usuário de ID '${USER_ID}' não encontrado!`,
    );
    expect(mockUserDetailsDtoMapper.createFromEntity).not.toHaveBeenCalled();
  });
});
