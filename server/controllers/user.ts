import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';

import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;
numRandomed: any;
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
   forgot = (req, res) => {
     
       this.numRandomed = Math.floor(Math.random()*(10-20+1)+10);
     this.model.findOneAndUpdate({ _id: req.body.email }, req.body, (err) => {
      if (err) { 
        return console.error(err);  
      }
      this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      console.log('emailId: ' + user );
      try {

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dotnet@mailtest.radixweb.net',
          pass: 'deep70'
        }
      });
     
     
      const mailOptions = {
        from: 'dotnet@mailtest.radixweb.net',
        to: user.email,
        subject: 'New Generated Password for User',
        text: `Dear User,
               This is your newly generated password from system.` + req.body.password 
      };
      console.log('mailOptions: ' + mailOptions );
      res.status(200).json({ message: 'Password has been sent.' });

    } catch (error) {
       console.log('error: ' + error );
    }
     
    });
     
      // user.comparePassword(req.body.password, (error, isMatch) => {
      //   if (!isMatch) { return res.sendStatus(403); }
      //   const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
      //   res.status(200).json({ token: token });
      // });
    });
  }

}
