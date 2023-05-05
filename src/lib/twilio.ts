const accountSid = 'AC15ecea4aabbe6966fbb724a6216e476a';
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

export const sendSms = async (phone: string, message: string) => {
  return client.messages
    .create({
      body: message,
      from: twilioPhone,
      to: phone,
    })
    .then((message: any) => {
      console.log(message.sid);
      return message;
    });
};
