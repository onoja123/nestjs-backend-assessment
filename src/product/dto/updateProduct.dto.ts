import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../../models/user.entity';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsString()
  readonly imageUrl: string;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
