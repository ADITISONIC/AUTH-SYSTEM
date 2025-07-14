import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js"
import { mailtrapclient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email,verficationToken)=>{
 try {
    const response = await mailtrapclient.send({
      from: sender,
      to: [{ email }],
      template_uuid: "63c2453e-d453-4b7d-bc32-ee2adb9b55e9",
      template_variables: {
        company_info_name: "Welcome",
        name:verficationToken
       }
    });
    console.log("email sent", response);   
 } catch (error) {
    console.log(error)
}
}

export const sendWelcomeMail = async (email,name)=>{
    if (!email) {
      console.error("No email provided to sendWelcomeMail");
      return;
    }
    
    try {
      const response =  await mailtrapclient.send({
          from: sender,
          to: [{email}],
          template_uuid: "63c2453e-d453-4b7d-bc32-ee2adb9b55e9",
          template_variables: {
                 company_info_name: "Auth company",
                  name: name
                }
        });
        console.log("Welcome Email sent succesfully",response)
    } catch (error) {
        console.log(error)
    }
}

export const sendPasswordResetEmail = async (email,resetUrl)=>{
    try {
        const response = await mailtrapclient.send({
          from: sender,
          to: [{ email }],
          template_uuid: "63c2453e-d453-4b7d-bc32-ee2adb9b55e9",
          template_variables: {
            company_info_name: "Password Reset email",
            name: resetUrl
          },
        });
    } catch (error) {
        
    }
}

export const sendResetSuccessEmail = async (email)=>{
    try {
        const response = mailtrapclient.send({
          from: sender,
          to: [{ email }],
          template_uuid: "63c2453e-d453-4b7d-bc32-ee2adb9b55e9",
          template_variables: {
            company_info_name: "Password Reset success",
          },
        });
        console.log("Password reset email sent",response)
    } catch (error) {
        console.log(error)
    }
}