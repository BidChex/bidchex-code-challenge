import { IsString, MinLength } from 'class-validator';

export class AwardDto {
  @IsString()
  @MinLength(1)
  bidId!: string;
}
