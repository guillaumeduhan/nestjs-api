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
  legal_name: string;

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
  location_country?: string;

  @ApiProperty({
    description: 'Portfolio company contact name',
    required: false,
  })
  @IsOptional()
  @IsString()
  portfolio_company_contact_name?: string;

  @ApiProperty({
    description: 'Portfolio company phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  portfolio_company_phone?: string;

  @ApiProperty({
    description: 'User ID',
    required: false,
    type: 'string',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiProperty({
    description: 'Address ID',
    required: false,
    type: 'string',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  address_id?: string;

  @ApiProperty({
    description: 'Asset type ID',
    required: false,
    type: 'string',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  asset_type_id?: string;

  @ApiProperty({
    description: 'Asset subtype ID',
    required: false,
    type: 'string',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  asset_subtype_id?: string;

  @ApiProperty({
    description: 'Created at timestamp',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  created_at?: Date;

  @ApiProperty({
    description: 'Updated at timestamp',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  updated_at?: Date;

  @ApiProperty({
    description: 'Deleted at timestamp',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  deleted_at?: Date;

  @ApiProperty({ description: 'Deleted by', required: false })
  @IsOptional()
  @IsString()
  deleted_by?: string;
}

export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
