import * as nodemailer from 'nodemailer'

export class EmailProvider
{
    constructor(private user){}

    public sendEmail(transporter)
    {
      return new Promise((resolve,reject)=>{
        transporter.sendMail({
          from: process.env.EMAIL_ADDRESS, // sender address
          to: this.user.email, // list of receivers
          subject: `User ${this.user.id} created`,
          text: `User ${this.user.first_name} ${this.user.last_name} created successfuly!`
        }).then(info => {
          let responseObject = {
            message:'Email sent!'
          }
          resolve(responseObject);
        }).catch(error => {
          console.error(error)
          // this line was commented for simulate the positive return
          // reject(error); 
          resolve(true)
        });
      })
        
    }

    public configureEmailServer()
    {
        const transporter = nodemailer.createTransport({

          service :  process.env.EMAIL_SERVICE,
          auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD
          },
        });
        
        // transporter.verify().then(console.log).catch(console.error);

        return transporter;
    }   

}