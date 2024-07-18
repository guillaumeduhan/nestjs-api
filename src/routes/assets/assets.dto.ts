import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({
    description: 'Deal ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  deal_id: string;

  @ApiProperty({
    description: 'Location',
    example: 'San Francisco, CA',
  })
  location: string;

  @ApiProperty({
    description: 'Security Type',
    example: 'safe',
  })
  security_type: string;

  @ApiProperty({
    description: 'Company Website',
    example: 'https://example.com',
    required: false,
  })
  company_website?: string;

  @ApiProperty({
    description: 'Instrument',
    example: 'Equity',
    required: false,
  })
  instrument?: string;

  @ApiProperty({
    description: 'Industry',
    example: 'Technology',
    required: false,
  })
  industry?: string;

  @ApiProperty({
    description: 'Legal Name',
    example: 'Example Inc.',
    required: false,
  })
  legal_name?: string;

  @ApiProperty({
    description: 'Logo URL',
    example: 'https://example.com/logo.png',
    required: false,
  })
  logo_url?: string;

  @ApiProperty({
    description: 'Name',
    example: 'Example Asset',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Notes',
    example: 'Some notes about the asset',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Offering Type',
    example: 'IPO',
    required: false,
  })
  offering_type?: string;

  @ApiProperty({
    description: 'Portfolio Company Contact',
    example: 'John Doe',
    required: false,
  })
  portfolio_company_contact?: string;

  @ApiProperty({
    description: 'Portfolio Company Phone',
    example: '+1-234-567-8900',
    required: false,
  })
  portfolio_company_phone?: string;

  @ApiProperty({
    description: 'Purchase Agreement ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  purchase_agreement_id?: string;

  @ApiProperty({ description: 'Status', example: 'draft', required: false })
  status?: string;

  @ApiProperty({ description: 'Type', example: 'startup', required: false })
  type?: string;

  @ApiProperty({ description: 'Valuation', example: 1000000, required: false })
  valuation?: number;

  @ApiProperty({
    description: 'Valuation Date',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  valuation_date?: Date;

  @ApiProperty({
    description: 'Website',
    example: 'https://example-asset.com',
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: 'Wire Instructions ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false,
  })
  wire_instructions_id?: string;
}

export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
