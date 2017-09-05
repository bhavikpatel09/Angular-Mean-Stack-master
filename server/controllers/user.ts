import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';

import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  }
  facebook = (req, res) => {
      debugger;
      passport.authenticate('facebook', { scope: 'email' });
      res.status(200).json({ token: '' });
  }
  facebookCallback = (req, res) => {
      passport.authenticate('facebook', {
          successRedirect: '/profile',
          failureRedirect: '/'
      });
  }

  twitter = (req, res) => {
      debugger;
      passport.authenticate('twitter');
      res.status(200).json({ token: '' });
  }
  twitterCallback = (req, res) => {
      passport.authenticate('twitter', {
          successRedirect: '/profile',
          failureRedirect: '/'
      });
  }
}
