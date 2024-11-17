const verifyEmailTemplate = ({ name, url }) => {
  return `<div>
    <p>Dear, ${name}</p>
    <p>Thank you for registering Blinkit.</p>
    <p>Please verify your email by clicking on the following link:</p>
    <p style="background:#071263; margin-top:10px; padding:20px color:white";>
    <a href="${url}">Verify Email</a>
    </p>
    </div>`;
};

export default verifyEmailTemplate;
