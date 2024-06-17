import { Controller, Body, Post, Request, Get, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsAdmin } from 'src/core/guards/IsAdmin';
import { LoginResponse, O365LoginResponse } from 'src/utils/types/auth';
import { ApiResponse, CustomRequest } from 'src/utils/types/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { EditAccountDto } from './dto/EditAccountDto';
import { LoginDto } from './dto/LoginDto';
import { USER_MESSAGE } from 'src/core/guards/constants/user';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { ResetPasswordDto } from './dto/ResetPasswordDto';

@Controller('auth')
export class AuthController {
    constructor(private AuthService: AuthService, private UserService: UserService, private readonly Prisma: PrismaService) { }

    @Post('login')
    @ApiOperation({ summary: 'User Login' })
    async login(@Body() body: LoginDto): Promise<ApiResponse<LoginResponse>> {
        return await this.AuthService.login(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseGuards(IsAdmin)
    @Post('change-password')
    @ApiOperation({ summary: 'Change password' })
    async changePassword(@Request() req: CustomRequest, @Body() body: ChangePasswordDto): Promise<ApiResponse<any>> {
        return await this.AuthService.changePassword(req.user.id, body);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'forgot password' })
    async create(@Body() email: { email: string }, @Request() req) {
        const response = await this.AuthService.forgotPasswordReq(email.email);
        return response
            ? { success: true, data: response }
            : { success: false, message: USER_MESSAGE.USER_ERROR };
    }

    @Post('forgot-password/edit')
    @ApiOperation({ summary: 'reset password' })
    async resetPassword(@Request() req: CustomRequest, @Query('token') token: string, @Body() body: ResetPasswordDto): Promise<ApiResponse<any>> {
        const response = this.AuthService.resetPassword(token, body);
        return response
    }

    @Post('clear-session')
    async clearSession(@Request() req, @Body() body: { keysToClear: string[] }): Promise<ApiResponse<any>> {
        // Clear session keys as needed
        const keysToClear = req.body.keys; // Assuming the keys to clear are sent in the request body
        const response = await this.AuthService.clearSession(req.session, keysToClear);
        return response
            ? { success: true, data: response }
            : { success: false, message: response.message };
        // return ({ data: response, message: 'Session cleared successfully' });

    }

    @UseGuards(AuthGuard('jwt'))
    @UseGuards(IsAdmin)
    @Get('account')
    @ApiOperation({ summary: 'Get account details' })
    async account(@Request() req: CustomRequest): Promise<ApiResponse<Omit<User, 'password'>>> {
        return await this.AuthService.getAccount(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseGuards(IsAdmin)
    @Post('account')
    @ApiOperation({ summary: 'Get account details' })
    async editAccount(@Request() req: CustomRequest, @Body() body: EditAccountDto): Promise<ApiResponse<Omit<User, 'password'>>> {
        return await this.AuthService.editAccount(req.user.id, body);
    }

    // get user after O365 authentication

    // Verify Azure active directory authentication token
    @Post('aad/validate-token')
    async aadValidateToken(@Body() res: any): Promise<ApiResponse<O365LoginResponse>> {
        if (res) {
            try {
                const verifyToken = this.AuthService.validateAccessToken({
                    exp: res.idTokenClaims.exp,
                    accessToken: res.accessToken,
                    iss: res.idTokenClaims.iss,
                    aud: res.idTokenClaims.aud
                }
                )
                if (verifyToken) {

                    // For example, check if the user exists in the database To do
                    // Generate JWT token or session token for the authenticated user
                    const response = await this.AuthService.loginO365({ email: res.account.username, oid: res.idTokenClaims.oid });
                    // Return user data and token to the frontend
                    if (response.success === true) {
                        return {
                            success: true,
                            data: { user: response.data.user, token: response.data.token },  // Include user // access token
                            message: "Login successfull."
                        }
                    }
                    else {
                        return {
                            success: false,
                            message: `User doesn't exit.` // Provide an appropriate error message
                        };
                    }
                }
                else {
                    return {
                        success: false,
                        message: 'Authentication failed' // Provide an appropriate error message
                    };
                }
            } catch (error) {
                // Handle errors if authentication fails
                return {
                    success: false,
                    message: 'Authentication failed' // Provide an appropriate error message
                };
            }
        }
        else {
            return {
                success: false,
                message: 'Login failed: Could not get response from https://login.microsoftonline.com'
            };
        }
    }

}
