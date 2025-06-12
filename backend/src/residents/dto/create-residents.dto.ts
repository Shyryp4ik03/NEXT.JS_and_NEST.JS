import { IsString } from 'class-validator';

export class CreateResidentDto {
  @IsString()
  fullName: string;

  @IsString()
  apartment: string;

  @IsString()
  pinCode: string;
}