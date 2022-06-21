import {ValidationError} from "../helpers/dbErrorHandler";
import UserModel from '../models/user.model';
import {FollowPayload} from "../helpers/schemas/user.schema";
import {ZodError} from "zod";
import dbErrorHandler from "../helpers/dbErrorHandler";

const index = async (req, res) => {
    try {
        const users = await UserModel.findMany();
        res.status(200).json(users)
    } catch (err) {
        console.error(err);
        res.status(500).send(err)
    }
};

const store = async (req, res, next) => {
    const {name, email, password} = req.body;
    const userData = {name, email, password};
    try {
        await UserModel.signUp(userData);
        return res.status(200).json({
            message: 'User saved successfully'
        })
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(422).json(e.errors)
        }
        next(e);
    }
};
const show = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: "Something went wrong"
        })
    }
};

const remove = async (req, res) => {
    try {
        await UserModel.deleteUserById(req.user.id);
        return res.status(200).json({
            message: "User removed successfully"
        });
    } catch (e) {
        console.error(e)
        res.status(500).json({
            error: "Deletion failed"
        })
    }
};

const update = async (req, res) => {
    try {
        const updatedUser = await UserModel.updateUser(req.user.id, req.body, req.file);
        return res.status(200).json(updatedUser);
    } catch (e) {
        console.error(e)
        res.status(400).json({
            error: "Cannot update user"
        })
    }
};

const userPhoto = async (req, res) => {
    try {
        const user = req.user;
        if (user.image.data) {
            res.set('Content-Type', user.image.contentType);
            res.send(user.image.data)
        }
    } catch (e) {
        res.status(400).json({
            'error': "Something went wrong"
        })
    }

}

const userById = async (req, res, next, id) => {
    try {
        const user = await UserModel.getUser(id);
        if (!user) {
            return res.status(400).send({
                error: 'User not found'
            });
        }
        req.user = user;
        next();
    } catch (e) {
        console.log(e)
        res.status(400).send({
            'error': "Could not retrieve user"
        })
    }
};

const addFollowing = async (req, res, next) => {
    try {
        const {followerID, followingID} = FollowPayload.parse(req.body);
        await UserModel.addFollowing({
            followerID, followingID
        })
        return next();
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(422).send({
                error: dbErrorHandler.processZodError(e)
            })
        } else {
            return next(e)
        }
    }
}

const addFollowed = async (req, res, next) => {
    try {
        const {followerID, followingID} = FollowPayload.parse(req.body);
        await UserModel.addFollower({
            followerID, followingID
        })
        return res.status(200).send()
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(422).send({
                error: e.message
            })
        } else {
            next(e)
        }
    }
}

const removeFollowing = async (req, res, next) => {
    try {
        const {followerID, followingID} = FollowPayload.parse(req.body);
        await UserModel.removeFollowing({
            followerID,
            followingID
        });
        return next()
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(422).send({
                error: e.message
            })
        } else {
            next(e)
        }
    }
}

const removeFollower = async (req, res, next) => {
    try {
        const {followerID, followingID} = FollowPayload.parse(req.body);
        await UserModel.removeFollowed({
            followerID,
            followingID
        });
        res.status(200).send()
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(422).send({
                error: e.message
            })
        } else {
            next(e)
        }
    }
}

const findPeopleToFollow = async (req, res) => {
    try {
        const unfollowedUsers = await UserModel.findUnfollowed(req.user);
        res.status(200).send({
            users: unfollowedUsers
        })
    } catch (e) {
        console.log(e)
    }
}


export default {
    index,
    store,
    show,
    remove,
    update,
    userPhoto,
    userById,
    addFollowing,
    addFollowed,
    removeFollowing,
    removeFollowed: removeFollower,
    findPeopleToFollow
}