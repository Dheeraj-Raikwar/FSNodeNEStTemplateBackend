/* Importing NestJS Packages */
import { Injectable, Logger } from '@nestjs/common';
import { PasswordRequest, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { readFile } from 'fs';
import { promisify } from 'util';
/* Importing Util services */
import { PrismaService } from 'src/prisma-service/prisma.service';
import { CreateUserDto } from "./dto/createUser.dto";
import { updateUserDto } from "./dto/updateUser.dto";
import { AllDataResponse, ApiResponse } from 'src/utils/types/common';
import { USER_STATUS } from 'src/core/guards/constants/user';
import { generateRandomString } from 'src/utils/funs';
import { FilterUserDto } from './dto/filterUser.dto';
import { first } from 'rxjs';
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

@Injectable()
export class UserService {
	constructor(
			private readonly Prisma: PrismaService
	) { }

	async findOneByEmail(email: string): Promise<User>{
		return await this.Prisma.user.findFirst({where:{
				email: email,
				status: 'Active'
			},		
			include:{
				userRole:{
					include:{
						role:{
							select: {
								id:true,
								name: true,
								alias: true,
								Permission: {select:{resources:true,action:true}}
							}
						},
					}
				}
			}
		});
	}

	async isActiveUser(email: string): Promise<User>{
		return await this.Prisma.user.findUnique({where:{
			email: email,
			status: {
				equals: 'Active'
			}
		}})
	}

	private async hashPassword(password: string) {
		const hash = await bcrypt.hash(password, 10);
		return hash;
	}
	
	/**
	 * Create new user
	 * @param user 
	 * @returns the user
	 */
	async create(user: CreateUserDto): Promise<ApiResponse<any>>{
		try {
			let roles = user.role
			delete user.role
			
			let userExist = await this.findOneByEmail(user.email);
			if(userExist){
				return {success:false, message:'Email Already Exists'}
			} 
			else {
				
				// Create Default Password for the user
				// let password = await this.hashPassword(process.env.DEFAULT_PASSWORD);
				user.password = '';				
				
				const response =  await this.Prisma.user.create({data:user});
				// this.resetPasswordReq(response.email)
				// Create User role
				let userRoleData = []
				for (let index = 0; index < roles.length; index++) {
					const roleId = roles[index];
					userRoleData.push({userId: response.id, roleId: roleId})
					
				}
				const userRole = await this.Prisma.userRoles.createMany({data:userRoleData})
				this.resetPasswordReq(response.email)
				return {success:true, data:response}
			}
			
		} catch (error) {
			return {success:false, message:error}
		}

	}

	
	/**
	 * Get the User by Id
	 * @param id 
	 * @returns the Active permission
	 */
    async findOneById(id: string): Promise<AllDataResponse<User>>{
		const res = await this.Prisma.user.findUnique({
			where:{
				id: id,
				status: 'Active'
			},
			include:{
				userRole:{
					include:{
						role:{
							select: {
								id:true,
								name: true,
								alias: true,
								Permission: true
				  			}
						},
					}
				}
			}
		});

		return {
			data: res
		}
	}

	/**
	 * this function is used to get all the user based on the filters
	 * @param filter 
	 * @returns the users
	 */
    async findAll(filter: FilterUserDto, userId: string): Promise<any>{
		try {
			
		let filterQuery: any = {};		
		// Get the filter from the query param
		// filterQuery = filter
		var offset = (filter?.skip) ? filter.skip : 0;
		var limit = (filter?.take) ? filter.take : 10;
		// Sorting based on the column
		var sortByColumn = (filter.sortField) ? filter.sortField : '';
		var pattern = (filter.search) ? filter.search : '';
		// filterQuery.orderBy =[]
		// Sorting the Columns
		if (sortByColumn !== '') {
			var direction = (filter.sortOrder) ?( filter.sortOrder == 'desc') ? 'desc':'asc' : 'asc';
			
			filterQuery.orderBy = [{[sortByColumn]: direction}];
		} else {
			filterQuery.orderBy = [{createdAt:'desc'}];
		}
		filterQuery.where = {};
		if (pattern) {
			filterQuery.where.OR= [
                { firstName: { contains: pattern, mode:'insensitive' } },
                { lastName: { contains: pattern, mode:'insensitive' } }
              ]
		}
		
		if(filter.filter.workType){
			filterQuery.where.workType ={equals:filter.filter.workType}
		}
		
		if(filter.filter.status){
			filterQuery.where.status ={equals:filter.filter.status}
		}

		if(filter.filter.isSubContractor){
			filterQuery.where.isSubContractor ={equals:filter.filter.isSubContractor}
		}

		if(filter.filter.role){
			filterQuery.include = {
				userRole: {
					where:{
						roleId:{ in:filter.filter.role}
					},
					include: {
					role: {include:{Permission:true}},
				},
			  }}
			  
		} else {
			filterQuery.include = {userRole: {
				include: {
				  role: {include:{Permission:true}},
				},
			  },}
		}
		
		// Setting Offset and limit
		filterQuery.skip = offset;
		filterQuery.take = limit;
		
		filterQuery.include = {userRole: {
			include: {
			  role: {include:{Permission:true}},
			},
		  },}
		const [users, count] = await this.Prisma.$transaction([
			this.Prisma.user.findMany(filterQuery),
			this.Prisma.user.count({where:filterQuery.where})
		]);
		let permission = (await this.userPermission(userId, "Users")).data

		return {
			data: users,
			count: count,
			permissions: permission
		}
		} catch (error) {
			return {success:false, error:error}
			
		}
	}
    
	/**
	 * This function is used to update the user details
	 * @param id 
	 * @param user 
	 * @returns the updated permission
	 */
    async update(id: string, user: updateUserDto): Promise<AllDataResponse<User>>{

		let roles = user.role;
		delete user.role;

		const res =  await this.Prisma.user.update({
            data: user,
            where: {
                id: id
            }
        });

		// Create User role
		let userRoleData = []
		for (let index = 0; index < roles.length; index++) {
			const roleId = roles[index];
			userRoleData.push({userId: id, roleId: roleId})
			
		}
		await this.Prisma.userRoles.deleteMany({where:{userId: id}})
		const userRole = await this.Prisma.userRoles.createMany({data:userRoleData})

		return {data: res}
	}

	/**
	 * This function is used to delete the user by Id
	 * @param id 
	 * @param user 
	 * @returns the updated permission
	 */
    async remove(id: string): Promise<AllDataResponse<User>>{
		try {
			await this.Prisma.userRoles.deleteMany({where:{userId: id}})	
		} catch (error) {
			console.error(error);	
		}
		const res = await this.Prisma.user.delete({
            where: {
                id: id
            }
        });

		return {data: res}
	}

	/**
	 * For newly created user sending the reset password email
	 * @param email 
	 * @returns succes or failure based on the response
	 */
	async resetPasswordReq(email: string): Promise<PasswordRequest> {
        const user = this.findOneByEmail(email);
        try {
            const id = (await user)?.id;
            const status = (await user)?.status;
            if (status === USER_STATUS.ACTIVE) {
                const token = generateRandomString(12);
                const isUserIdExists = await this.Prisma.passwordRequest.findFirst({
                    where: { userId: id },
                })
                var res: PasswordRequest;
                if (isUserIdExists) {
                    res = await this.Prisma.passwordRequest.update({
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
                    res = await this.Prisma.passwordRequest.create({
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
                    const templatePath = process.cwd() + '/src/core/common/reset_password_template.html';
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
                    throw new Error('Failed to generate reset password email');
                }

                // Setup email data
                const mailOptions = {
                    from: process.env.useremail,
                    to: email,
                    subject: 'Welcome to APP - Set Up Your Account Password',
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


	
  /**
   * Get the User Permissions
   * @param userId 
   * @returns  User Permissions
   */
  async userPermission(userId: string, resourceName: string) {
    try {
      let userDetails = await this.Prisma.user.findFirst({where:{ id:userId}, 
        include:{
          userRole:{
            include:{
              role:{
                select: {
                  id:true,
                  name: true,
                  alias: true,
                  Permission: true
                  }
              },
            }
          }
        }
      });
      
      
	const permissions = userDetails && userDetails.userRole?.[0]?.role?.Permission;
    const isUsers = userDetails && userDetails.userRole.some((d: { role: { name: string; }; })=>{ return d.role.name=='Admin' });
    const hasWriteAccess = permissions.some((permission: any) =>
      permission.resources === resourceName && permission.action.write === true
    );
    const hasReadAccess = permissions.some((permission: any) =>
      permission.resources === resourceName && permission.action.read === true)

	const canCreateProject = permissions.some((permission: any) =>
		permission.resource?.includes(resourceName) && permission.actions.write === true
	);
    return { success: true, data: {write: hasWriteAccess,read:hasReadAccess,admin:isUsers, canCreateProject: canCreateProject} }
    } catch (error) {
      Logger.error('Error ', error)
      return { success: false, message: 'Internal Server error' }
    }
  }

}

