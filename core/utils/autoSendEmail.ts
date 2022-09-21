import nodemailer from "nodemailer";

export interface SendEmailOptions {
  authUser: string;
  authPass: string;
  emailTitle: string;
  emailSubject: string;
  receiveUsers: string[];
  emailText?: string;
  emailContent?: string;
}

enum EMAIL_HOST {
  "QQ" = "smtp.qq.com",
}

enum EMAIL_PORT {
  "QQ" = 465,
}

/**
 * Auto send email
 * @param options
 */
export const sendEmail = async function (options: SendEmailOptions) {
  const {
    authUser,
    authPass,
    emailTitle,
    emailSubject,
    emailContent,
    emailText,
    receiveUsers,
  } = options;

  const emailHost = EMAIL_HOST.QQ;
  const emailPort = EMAIL_PORT.QQ;

  // create transport
  let transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465 ? true : false,
    auth: {
      user: authUser,
      pass: authPass,
    },
  });

  // send email
  await transporter.sendMail({
    from: `${emailTitle}<${authUser}>`,
    to: receiveUsers.join(","),
    subject: emailSubject,
    html: emailContent ? emailContent : emailText ? emailText : "",
  });
};
