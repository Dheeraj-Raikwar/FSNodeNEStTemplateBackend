
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PasswordRequest, User, UserStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { LoginDto } from './dto/LoginDto';
import { UserService } from '../user/user.service';
import { LoginResponse, O365LoginResponse } from 'src/utils/types/auth';
import { ApiResponse } from 'src/utils/types/common';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { EditAccountDto } from './dto/EditAccountDto';
import { USER_STATUS } from 'src/core/guards/constants/user';
import { generateRandomString } from 'src/utils/funs';
import { readFile } from 'fs';
import { promisify } from 'util';
import { ResetPasswordDto } from './dto/ResetPasswordDto';
const nodemailer = require("nodemailer");

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
        user: process.env.useremail,
        pass: process.env.password,
    },
});


// Define the interface for the authentication response
interface IdTokenClaims {
    exp: number;
    accessToken: string;
    iss: string;
    aud: string;
}

@Injectable()
export class AuthService {
    static validateAccessToken(idTokenClaims: IdTokenClaims): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    constructor(
        private readonly jwtService: JwtService,
        private readonly UserService: UserService,
        private readonly PrismaService: PrismaService,

    ) { }

    async login(data: LoginDto): Promise<ApiResponse<LoginResponse>> {
        const userExists = await this.UserService.findOneByEmail(data.username);
        if (userExists) {
            if (userExists.status === UserStatus.Inactive) return { success: false, message: 'Please activate your account' }
            const isCorrectPassword = await this.comparePassword(data.password, userExists.password);
            if (!isCorrectPassword) { 
                return { success: false, message: `User's name or Password is incorrect` }
            } else {
                const token = await this.generateToken(userExists);
                const { password, ...userData } = userExists;
                return { success: true, data: { user: userData, token: token } }
            }
        }
        return { success: false, message: `User's name or Password is incorrect` }

    }

    async loginO365(user: any): Promise<ApiResponse<O365LoginResponse>> {
        const existingUser = await this.UserService.findOneByEmail(user.email);
        if (existingUser) {
            if (existingUser.status === UserStatus.Inactive) return { success: false, message: 'Please activate your account' }
            const token = await this.generateToken(existingUser);
            const { password, ...userData } = existingUser;
            return { success: true, data: { user: userData, token: token } }
        }
        return { success: false, message: `User doesn't exit.` }
    }

    async validateAccessToken(idTokenClaims: IdTokenClaims): Promise<boolean> {
        try {
            // Check if token is expired
            if (idTokenClaims?.exp && Date.now() >= idTokenClaims?.exp * 1000) {
                throw new Error('Access token has expired');
            }
            // Validate issuer and audience
            if (idTokenClaims.iss !== `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0` ||
                idTokenClaims.aud !== process.env.CLIENT_ID) {
                throw new Error('Invalid issuer or audience');
            }

            return true; // Token is valid
        } catch (error) {
            return false; // Token validation failed
        }
    }

    async validateUser(username: string, pass: string) {
        const user = await this.UserService.findOneByEmail(username);
        if (!user) return null;
        const match = await this.comparePassword(pass, user.password);
        if (!match) return null;
        const { password, ...result } = user['dataValues'];
        return result;
    }

    async changePassword(id: string, data: ChangePasswordDto): Promise<ApiResponse<any>> {
        const { newPassword, oldPassword } = data;
        const user = (await this.UserService.findOneById(id)).data;
        if (!user) return null;
        const isCorrectPassword = await this.comparePassword(oldPassword, user.password);
        if (!isCorrectPassword) return { success: false, message: 'Incorrect password' }
        if (oldPassword == newPassword) return { success: false, message: 'New password cannot be the same as old password' }
        user.password = await this.hashPassword(newPassword);
        const response = await this.PrismaService.user.update({
            data: user,
            where: {
                id: id
            }
        })
        return {
            success: true,
            data: {},
            message: 'Password reset successfully'
        }
    }

    async forgotPasswordReq(email: string): Promise<PasswordRequest> {
        const user = this.UserService.findOneByEmail(email);
        try {
            const id = (await user)?.id;
            const status = (await user)?.status;
            if (status === USER_STATUS.ACTIVE) {
                const token = generateRandomString(12);
                const isUserIdExists = await this.PrismaService.passwordRequest.findFirst({
                    where: { userId: id },
                })
                var res: PasswordRequest;
                if (isUserIdExists) {
                    res = await this.PrismaService.passwordRequest.update({
                        where: { id: isUserIdExists.id },
                        data: {
                            userId: id,
                            token: token,
                            exp: new Date(Date.now() + 3600000),
                            isActive: true,
                            updatedAt: new Date(),
                        }
                    });
                }
                else {
                    res = await this.PrismaService.passwordRequest.create({
                        data: {
                            userId: id,
                            token: token,
                            exp: new Date(Date.now() + 3600000),
                            isActive: true,
                            updatedAt: new Date(),
                        }
                    });
                }

                var modifiedHtml = "<>";

                try {
                    // Resolve the path to the HTML template file
                    const templatePath = process.cwd() + '/src/core/common/forgot_password_template.html';
                    // Read the HTML template file asynchronously
                    const readFileAsync = promisify(readFile);
                    const htmlTemplate = await readFileAsync(templatePath, 'utf8');;

                    // Replace the placeholders with the dynamic values
                    modifiedHtml = htmlTemplate.replace('{{username}}', (await user).firstName)
                    modifiedHtml = modifiedHtml.replace('{{protocol}}', process.env.protocol)
                    modifiedHtml = modifiedHtml.replace('{{domain}}', process.env.domain)
                    modifiedHtml = modifiedHtml.replace('{{token}}', token)

                }
                catch (error) {
                    throw new Error('Failed to generate forgot password email');
                }

                // Setup email data
                const mailOptions = {
                    from: process.env.useremail,
                    to: process.env.useremail1,
                    subject: 'Reset your password for APP >>',
                    html: modifiedHtml,
                };

                // Send the email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        // console.log('Email sent:', info.response);
                    }
                });
                return res;
            }
        }
        catch (erorr) {
            console.error("error", erorr);
        }
    }

    async resetPassword(token: string, data: ResetPasswordDto): Promise<ApiResponse<any>> {
        const { newPassword, confirmPassword } = data;
        const passwordRequest = await this.PrismaService.passwordRequest.findFirst({
            where: {
                token: token
            },
            select: {
                id: true,
                userId: true,
                exp: true
            }
        });

        if (!passwordRequest) {

            return {
                success: false,
                message: 'Password reset token not found'
            }
        }

        const currentDatetime = new Date();
        const tokenExpDatetime = new Date(passwordRequest.exp);

        if (tokenExpDatetime > currentDatetime) {
            // Token is still valid, perform reset password logic
            const id = passwordRequest.userId;
            const user = (await this.UserService.findOneById(id)).data;
            if (!user) return null;
            if (newPassword !== confirmPassword) return { success: false, message: 'Password Mismatch' }
            user.password = await this.hashPassword(newPassword);
            const response = await this.PrismaService.user.update({
                data: {
                    password: user.password
                },
                where: {
                    id: id
                }
            });
            // Delete the password token
            await this.PrismaService.passwordRequest.deleteMany({
                where: {
                    userId: id,
                },
            });

            // send the password reset confirmation email and return the response.
            var modifiedHtml = "<>";

            try {
                // Resolve the path to the HTML template file
                const templatePath = process.cwd() + '/src/core/common/reset_password_success_template.html';
                // Read the HTML template file asynchronously
                const readFileAsync = promisify(readFile);
                const htmlTemplate = await readFileAsync(templatePath, 'utf8');;

                // Replace the placeholders with the dynamic values
                modifiedHtml = htmlTemplate.replace('{{username}}', (await user).firstName)
                modifiedHtml = modifiedHtml.replace('{{email}}', (await user).email)
            }
            catch (error) {
                console.error('Error reading HTML template file:', error);
                throw new Error('Failed to generate forgot password email');
            }

            // Setup email data
            const mailOptions = {
                from: process.env.useremail,
                to: process.env.useremail1,
                subject: 'Your App password has been changed >>',
                html: modifiedHtml,
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    // console.log('Email sent:', info.response);
                }
            });

            return {
                success: true,
                data: {},
                message: 'Password reset successfully'
            }

        } else {
            // Token has expired, handle accordingly
            return {
                success: false,
                message: 'Password reset link has expired'
            }
        }
    }

    async clearSession(session: any, keysToClear: string[]) {
        try {
            // Iterate over the keys to clear and delete them from the session
            keysToClear.forEach(key => {
                delete session[key];
            });
            return { success: true, message: 'Session keys cleared successfully' };
        } catch (error) {
            return { success: false, message: error.message || 'Failed to clear session keys' };
        }
    }

    private async generateToken(user: User) {
        const payload = { username: user.email, id: user.id };
        const token = await this.jwtService.signAsync(payload);
        return token;
    }

    private async hashPassword(password: string) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    async decodeToken(authorization: string) {
        const jwt_token = authorization.replace("Bearer ", "");
        const token = this.jwtService.decode(jwt_token);
        return token;
    }

    private async comparePassword(enteredPassword: string, dbPassword: string) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

    async getAccount(userId: string): Promise<ApiResponse<Omit<User, 'password'>>> {
        const user = await this.UserService.findOneById(userId);
        if (!user) return null;
        const { password, ...userDetails } = user.data;
        return { success: true, data: userDetails }
    }

    async editAccount(userId: string, body: EditAccountDto): Promise<ApiResponse<Omit<User, 'password'>>> {
        var user = { firstName: body.firstName, lastName: body.lastName };
        const response = await this.PrismaService.user.update({
            data: user,
            where: {
                id: userId
            }
        });
        const { password, ...userData } = response;
        return { success: true, data: userData }
    }

}

