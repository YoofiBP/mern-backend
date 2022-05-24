import crypto from 'crypto';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';

const encryptPassword = (password, salt) => {
    if (!password || password?.length < 6) throw Error('Password must be at least 6 characters')
    try {
        return crypto.createHmac('sha1', salt).update(password).digest('hex');
    } catch (err) {
        console.error(err);
    }
}

const authenticate = ({email, password}) => {
    const user = prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new Error('')
    }

    if (encryptPassword(password, user.salt) !== user.password) {
        throw new Error("Authentication failed")
    }

    return true;
}

const makeSalt = () => String(Math.round((new Date().valueOf() * Math.random())))

const emailIsValid = (email) => {
    return isEmail(email)
}

const passwordIsValid = (password) => {
    return {
        isValid: isStrongPassword(password),
        message: ''
    }
}

const signUp = (prisma) => ({email, password}) => {
    if (!emailIsValid(email)) {
        throw new Error('Image Invalid')
    }
    const passwordValid = passwordIsValid(password)
    if (!passwordValid.isValid) {
        throw new Error(passwordValid.message)
    }

    return prisma.create({
        email,
        password
    })
}

export default function Users(prisma) {
    return Object.assign(prisma, {
        authenticate,
        signUp: signUp(prisma)
    })
}