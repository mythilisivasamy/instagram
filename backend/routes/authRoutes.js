import express from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { CustomError } from '../middleware/errorHandler.js';
import { isAuth } from '../middleware/protectedRoute.js';

const authRouter = express.Router();

authRouter.post('/signup', (req, res) => {
  const { userName, password,fullName, email,phoneNumber } = req.body;

  User.findOne({ userName })
    .then((userInDB) => {
      if (userInDB) {
        return res.status(403).json({
          message: 'User with this name already exist',
          statusCode: '403',
        });
      }
      bcryptjs.hash(password, 16).then((hashedpwd) => {
        const user = new User({
          userName,
          password: hashedpwd,
          fullName,
          email,
          phoneNumber
        });
        user
          .save()
          .then(() => {
            res.status(201).json({
              message: 'User Signed Up Successfully',
              statusCode: '201',
            });
          })
          .catch((err) => {
            return res.status(501).json({ message: 'Signup failed' + err });
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

authRouter.post('/login', (req, res, next) => {
  const { userName, password } = req.body;
  User.findOne({ userName})
    .then((userInDB) => {
      if (!userInDB) {
        return res.status(202).json({
          message: 'Invalid userName',
          statusCode: '202',
        });
      }
      bcryptjs.compare(password, userInDB.password).then((isMatched) => {
        if (isMatched) {
          const jwtToken = jwt.sign(
            { _id: userInDB._id },
            process.env.JWT_SECRET
          );
          res.status(201).json({
            authInfo: {
              token: jwtToken,
              userName: userInDB.userName,
              _id: userInDB._id,
            },
            message: 'User Logged In Successfully',
            statusCode: '201',
          });
        } else {
          res
            .status(202)
            .json({ message: 'Invalid Password', statusCode: '202' });
        }
      });
    })
    .catch(() => {
      const err = new CustomError(`Internal server error`, 500);
      next(err);
    });
});

authRouter.put('/profile', isAuth, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    const hashedpwd = await bcryptjs.hash(password, 16);
    user.password = hashedpwd;
    const updatedUser = await user.save();
    return res.status(201).json({
      message: 'User profile updated',
      statusCode: '201',
      user: updatedUser,
    });
  } else {
    return res.status(404).json('User not found');
  }
});
export default authRouter;
