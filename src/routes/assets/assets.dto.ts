import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  IsDate,
} from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ description: 'Legal name of the asset', required: true })
  @IsString()
  @IsNotEmpty()
  legalName: string;

  @ApiProperty({ description: 'Name of the asset', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Industry of the asset', required: false })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({
    description: 'Country location of the asset',
    required: false,
  })
  @IsOptional()
  @IsString()
  locationCountry?: string;

  @ApiProperty({
    description: 'Portfolio company contact name',
    required: false,
  })
  @IsOptional()
  @IsString()
  portfolioCompanyContactName?: string;

  @ApiProperty({
    description: 'Portfolio company phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  portfolioCompanyPhone?: string;

  @ApiProperty({
    description: 'User ID',
    required: false,
    type: 'string',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'Address ID',
    required: false,
    type: 'string',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  addressId?: string;

  @ApiProperty({
    description: 'Asset type ID',
    required: false,
    type: 'string',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  assetTypeId?: string;

  @ApiProperty({
    description: 'Asset subtype ID',
    required: false,
    type: 'string',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  assetSubtypeId?: string;

  @ApiProperty({
    description: 'Created at timestamp',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({
    description: 'Updated at timestamp',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @ApiProperty({
    description: 'Deleted at timestamp',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @ApiProperty({ description: 'Deleted by', required: false })
  @IsOptional()
  @IsString()
  deletedBy?: string;
}

export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
