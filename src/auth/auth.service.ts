import { SUPABASE_CLIENT } from '@/providers/supabase.providers';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabaseClient: SupabaseClient
  ) { }

  async login(body: any) {
    const { email, password } = body;
    if (!email || !password) throw new HttpException(
      {
        status: 401,
        error: 'Missing email or password'
      },
      HttpStatus.FORBIDDEN
    );
    try {
      const { data, error }: any = await this.supabaseClient
        .auth
        .signInWithPassword({
          email,
          password,
        })

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
          error: 'Invalid credentials'
        },
        HttpStatus.FORBIDDEN
      );
    }
  }

  async signUp(body: any) {
    const { email, password } = body;
    if (!email || !password) throw new HttpException(
      {
        status: 401,
        error: 'Missing email or password'
      },
      HttpStatus.FORBIDDEN
    );
    try {
      const { data, error }: any = await this.supabaseClient
        .auth
        .signUp({
          email,
          password,
        })

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
          error: 'Signup failed'
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
}