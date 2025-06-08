import { IsString, IsInt, Min, IsDateString, IsIn } from 'class-validator';

export class CreateBuildDto {
  @IsString()
  name: string;

  @IsIn(['high', 'medium', 'low'])
  securityLevel: string;

  @IsInt()
  @Min(1)
  floors: number;

  @IsDateString()
  lastInspection: string;
}