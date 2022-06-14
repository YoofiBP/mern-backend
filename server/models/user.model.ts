import {createHmac} from 'crypto';
import isEmail from 'validator/lib/isEmail';
import contains from 'validator/lib/contains';
import {PrismaClient} from '@prisma/client'
import prisma from '../prisma/prisma';
import {AuthenticationError, ValidationError} from "../helpers/dbErrorHandler";
import async from "async";
import {z} from "zod";
import {FollowPayload} from "../helpers/schemas/user.schema";

const excludeFields = (user) => {
    const protectedFields = ['password', 'salt'];

    for (let field of protectedFields) {
        delete user[field];
    }

    return user;
}

const encryptPassword = (password, salt) => {
    try {
        return createHmac('sha1', salt).update(password).digest('hex');
    } catch (err) {
        console.error(err);
    }
}

const authenticate = async ({email, password}) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new AuthenticationError()
    }

    if (encryptPassword(password, user.salt) !== user.password) {
        throw new AuthenticationError()
    }

    return excludeFields(user);
}

const makeSalt = () => String(Math.round((new Date().valueOf() * Math.random())))

const emailIsValid = (email) => {
    return isEmail(email)
}

const nameIsValid = (name) => {
    return name.length > 1
}

const passwordIsValid = (password) => {
    const errors = [];
    if (!password) {
        errors.push('Password is required')
    }
    if (password?.length < 8) {
        errors.push('Password must be at least 8 characters')
    }
    if (password && contains(password, 'password')) {
        errors.push('Password should not contain the word password')
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            message: errors.join(',')
        }
    } else {
        return {
            isValid: true,
            message: ""
        }
    }
}

type SignUpValidation = {
    name?: string;
    email?: string;
    password?: string;
}

const signUp = (prisma) => async ({email, password, name}) => {
    const errors: SignUpValidation = {};

    if (!nameIsValid(name)) {
        errors.name = 'User name too short'
    }

    if (!emailIsValid(email)) {
        errors.email = 'Invalid email'
    }

    const existingUser = await prisma.findUnique({
        where: {
            email
        }
    })

    if (existingUser !== null) {
        throw new ValidationError({
            error: "User already exists"
        })
    }

    const passwordValid = passwordIsValid(password)

    if (!passwordValid.isValid) {
        errors.password = passwordValid.message
    }

    if (Object.keys(errors).length > 0) {
        throw new ValidationError(errors);
    }

    const salt = makeSalt();

    const hashed_password = encryptPassword(password, salt);

    return await prisma.create({
        data: {
            name,
            email,
            password: hashed_password,
            salt,
        }
    })
}

const getUser = (prisma) => async (id) => {
    const user = await prisma.findUnique({
        where: {
            id
        },
        include: {
            followers: true,
            following: true
        }
    })

    return excludeFields(user);
}

const deleteUserById = (prisma) => async (id) => {
    return prisma.delete({
        where: {
            id
        }
    })
}

const updateUser = (prisma) => async (id, updateData, imageFile) => {
    const allowedUpdateFields = ["name", "email", "password", "about"];
    Object.keys(updateData).forEach(userField => {
        if (!allowedUpdateFields.includes(userField) || !updateData[userField]) {
            delete updateData[userField];
        }
    })

    if (imageFile) {
        updateData.image = {
            contentType: imageFile.mimetype,
            data: imageFile.buffer
        }
    }

    return prisma.update({
        where: {
            id
        },
        data: {
            ...updateData
        }
    })
}

const addFollowing = (prisma: PrismaClient["user"]) =>
    async ({followerID, followingID}: z.infer<typeof FollowPayload>) => {
        //check if they are valid users
        const users = await prisma.findMany({
            where: {
                id: {in: [followerID, followingID]}
            }
        })

        const [follower, following] = users;
        if (!follower || !following) {
            throw Error('Invalid users')
        }
        await prisma.update({
            where: {
                id: follower.id
            },
            data: {
                followingIDs: {
                    push: following.id
                }
            }
        })
    }

const addFollower = (prisma: PrismaClient["user"]) => async ({
                                                                 followerID,
                                                                 followingID
                                                             }: z.infer<typeof FollowPayload>) => {
    const users = await prisma.findMany({
        where: {
            id: {in: [followerID, followingID]}
        }
    })

    const [follower, following] = users;
    if (!follower || !following) {
        throw Error('Invalid users')
    }
    await prisma.update({
        where: {
            id: following.id
        },
        data: {
            followersIDs: {
                push: follower.id
            }
        }
    })
}

const removeFollowing = (prisma) => async()

function Users(prisma: PrismaClient['user']) {
    return Object.assign(prisma, {
        authenticate,
        signUp: signUp(prisma),
        getUser: getUser(prisma),
        deleteUserById: deleteUserById(prisma),
        updateUser: updateUser(prisma),
        addFollowing: addFollowing(prisma),
        addFollower: addFollower(prisma)
    })
}


const UserModel = Users(prisma.user);

export default UserModel;