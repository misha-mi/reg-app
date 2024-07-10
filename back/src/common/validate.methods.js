const LOGIN_REGEXP =
  /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u;
const PASSWORD_REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
const NUMBER_REGEXP = /^[0-9]{4}$/;

export class ValidateMethods {
  validateLogin(login) {
    if (!login) {
      return "Please provide login";
    } else if (!LOGIN_REGEXP.test(login)) {
      return "Please enter the correct login";
    } else {
      return null;
    }
  }

  validatePassword(password, isLogin) {
    if (!password) {
      return "Please provide password";
    } else if (!PASSWORD_REGEXP.test(password) && !isLogin) {
      return "The password is too easy";
    } else {
      return null;
    }
  }

  validateName(name) {
    if (!name) {
      return "Please provide name";
    } else {
      return null;
    }
  }

  validateNumber(number) {
    if (!number) {
      return "Please provide SIP number";
    } else if (!NUMBER_REGEXP.test(number)) {
      return "SIP Number must consist of 4 numbers";
    } else {
      return null;
    }
  }
}
