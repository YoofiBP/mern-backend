import UserModel from "../models/user.model";
import dbErrorHandler from "../helpers/dbErrorHandler";

const index = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users)
    } catch (err) {
        console.error(err);
        res.status(500).send(err)
    }
};

const store = async (req, res) => {
    const {name, email, password} = req.body;
    const userData = {name, email, password};
    try {
        const user = new UserModel(userData);
        await user.save();
        return res.status(200).json({
            message: 'User saved successfully'
        })
    } catch (e) {
        return res.status(400).json(dbErrorHandler.getErrorMessage(e))
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
        await UserModel.findByIdAndRemove(req.user._id);
        return res.status(200).json({
            message: "User removed successfully"
        });
    } catch (e) {
        res.status(500).json({
            error: "Deletion failed"
        })
    }
};
const update = async (req, res) => {
    try {
        const allowedUpdateFields = ["name", "email", "password"];
        const updatedUser = req.user;
        allowedUpdateFields.forEach((field) => {
            if (req.body[field]) {
                updatedUser[field] = req.body[field];
            }
        })
        await updatedUser.save();
        return res.status(200).json(updatedUser);
    } catch (e) {
        res.status(500).json({
            error: "Cannot update user"
        })
    }
};

const userById = async (req, res, next, id) => {
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).send({
                error: 'User not found'
            });
        }
        req.user = user;
        next();
    } catch (e) {
        res.status(400).send({
            'error': "Could not retrieve user"
        })
    }
};

export default {
    index,
    store,
    show,
    remove,
    update,
    userById
}