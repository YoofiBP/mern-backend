import mongoose from "mongoose";
import validator from 'validator';
import crypto from 'crypto';

const {Schema} = mongoose;

const userSchema = new Schema({
        name: {
            type: String,
            trim: true,
            required: [true, 'Name is required']
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Email is required'],
            validate: {
                validator: (emailValue) => validator.isEmail(emailValue),
                message: 'Please fill a valid email address'
            }
        },
        hashed_password: {
            type: String,
            required: [true, 'Password is required'],
            validate: {
                validator: function () {
                    if (this._password?.length < 6) {
                        this.invalidate('password', 'Password must be at least 6 characters long');
                    }
                    if (this.isNew && !this._password) {
                        this.invalidate('password', 'Password is required');
                    }
                }
            }
        },
        salt: {type: String}
    },
    {timestamps: true});

userSchema.methods = {
    authenticate: function (plainTextPassword) {
        return this.encryptPassword(plainTextPassword) === this.hashed_password
    },
    makeSalt: () => String(Math.round((new Date().valueOf() * Math.random()))),
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
        } catch (err) {
            console.error(err);
            return '';
        }
    }
}

userSchema
    .virtual('password')
    .set(function (passwordValue) {
        this._password = passwordValue;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(passwordValue);
    }).get(function () {
    return this._password;
})

userSchema.set('toJSON', {
    transform: function (doc, obj) {
        delete obj.hashed_password;
        delete obj.salt;
        return obj
    }
})

const UserModel = mongoose.model('User', userSchema);

export default UserModel;