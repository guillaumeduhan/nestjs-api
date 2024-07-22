import { SupabaseGuard } from '@/auth/supabase/supabase.guard';
import { Controller, Get, Post, Request, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './auth.dto';
import { AuthService } from './auth.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@ApiTags('authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('auth/signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User signed up successfully.' })
  @ApiResponse({ status: 401, description: 'Missing email or password.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: SignUpDto })
  async signup(@Request() req) {
    return this.authService.signUp(req.body);
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Login a new user' })
  @ApiResponse({ status: 201, description: 'Logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Missing email or password.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: SignUpDto })
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @UseGuards(SupabaseGuard)
  @Get('auth/me')
  @ApiOperation({ summary: 'Get current user' })
  getProfile(@Request() req) {
    return req.user;
  }
}
