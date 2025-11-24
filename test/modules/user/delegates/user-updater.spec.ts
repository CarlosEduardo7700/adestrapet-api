import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { UserDetailsDtoMapper } from 'src/modules/user/factories/user-details.dto.mapper';
import { UserUpdater } from 'src/modules/user/delegates/user-updater';
import { UpdateUserDtoMapper } from 'src/modules/user/factories/update-user.dto.mapper';

describe('UserUpdater Class', () => {
  let userUpdater: UserUpdater;

  const mockUserRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockUpdateUserDtoMapper = {
    toUpdatedData: jest.fn(),
  };

  const mockUserDetailsDtoMapper = {
    createFromEntity: jest.fn(),
  };

  const USER_ID = 'uuid-123';

  const userMock = {
    id: USER_ID,
    name: 'Test Updated User',
    email: 'test@example.com',
    streaks: 0,
    lastAccess: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const updateUserDtoMock = {
    name: 'Test Updated User',
    email: 'test@example.com',
    password: 'test',
  };

  const userDetailsDtoMock = {
    id: USER_ID,
    name: 'Test Updated User',
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
        UserUpdater,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: UpdateUserDtoMapper,
          useValue: mockUpdateUserDtoMapper,
        },
        {
          provide: UserDetailsDtoMapper,
          useValue: mockUserDetailsDtoMapper,
        },
      ],
    }).compile();

    userUpdater = module.get<UserUpdater>(UserUpdater);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('It should return the data of the updated user.', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(userMock);
    mockUpdateUserDtoMapper.toUpdatedData.mockResolvedValue(updateUserDtoMock);
    mockUserRepository.save.mockResolvedValue(userMock);
    mockUserDetailsDtoMapper.createFromEntity.mockResolvedValue(
      userDetailsDtoMock,
    );

    const result = await userUpdater.updateUser(USER_ID, updateUserDtoMock);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: USER_ID });
    expect(mockUpdateUserDtoMapper.toUpdatedData).toHaveBeenCalledWith(
      updateUserDtoMock,
    );
    expect(mockUserRepository.save).toHaveBeenCalledWith(userMock);
    expect(mockUserDetailsDtoMapper.createFromEntity).toHaveBeenCalledWith(
      userMock,
    );
    expect(result).toEqual(userDetailsDtoMock);
  });
});
