import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, 'main')
    private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.userEmail);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { userEmail: email } });
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { userId: id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateData = {};
    if (updateUserDto.userFirstName !== undefined) {
      updateData['userFirstName'] = updateUserDto.userFirstName;
    }
    if (updateUserDto.userLastName !== undefined) {
      updateData['userLastName'] = updateUserDto.userLastName;
    }
    return this.userRepository.update(id, updateData);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.userRepository.remove(user);
  }

  async updateRefreshToken(userId: number, rawRefreshToken: string | null) {
    // console.log('userId',userId);
    // console.log('rawRefreshToken',rawRefreshToken);
    if (rawRefreshToken === null) {
      return this.userRepository.update(userId, { refreshToken: "" });
    }
    
    const hashedToken = await bcrypt.hash(rawRefreshToken, 10);
    return this.userRepository.update(userId, { refreshToken: hashedToken });
  }
}
