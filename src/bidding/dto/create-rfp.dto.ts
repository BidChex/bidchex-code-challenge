import { IsInt, IsISO8601, IsString, MinLength, Min } from 'class-validator';

export class CreateRfpDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsInt()
  @Min(1)
  budgetCapCents!: number;

  @IsISO8601()
  submissionDeadline!: string;
}
