import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SignUpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabaseClient: SupabaseClient
  ) { }

  async login(body: SignUpDto) {
    const { email } = body;
    if (!email) throw new HttpException(
      {
        status: 401,
        error: 'Missing'
      },
      HttpStatus.FORBIDDEN
    );
    try {
      const { data, error }: any = await this.supabaseClient
        .auth
        .signInWithOtp({
          email,
          options: {
            shouldCreateUser: true
          }
        })

      if (data) {
        return {
          status: 200,
          message: "An email with a code has been sent."
        }
      }
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: 'Invalid credentials',
          message: error.message
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async verify(body: any) {
    const { token, email } = body;
    if (!token || !email) throw new HttpException(
      {
        status: 401,
        error: 'Missing body.'
      },
      HttpStatus.FORBIDDEN
    );
    try {
      const { data, error }: any = await this.supabaseClient
        .auth
        .verifyOtp({
          token,
          email: email,
          type: "email",
        });

      if (data) {
        const { session } = data;
        const { access_token } = session;
        if (!access_token) throw new HttpException({
          status: 401,
          error: 'No access token provided'
        }, HttpStatus.FORBIDDEN);
        return {
          access_token
        }
      }

    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: 'Verify OTP failed'
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}