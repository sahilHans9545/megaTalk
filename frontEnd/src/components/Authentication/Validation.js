const userNameVerify = (error = {}, values) => {
  if (!values.username) {
    error.username = "Username Required...!";
  } else if (values.username.includes(" ")) {
    error.username = "Invalid Username...!";
  }
  return error;
};

export const userNameValidate = (values) => {
  const errors = userNameVerify({}, values);
  return errors;
};
