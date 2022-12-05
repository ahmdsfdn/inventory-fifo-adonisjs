import moment from 'moment';
import 'moment-timezone';

class Helper {
  static formatDate(date_string,tz_string="Asia/Jakarta"){
    const now = new Date();
    return moment.tz(new Date(date_string).setHours(now.getHours(),now.getMinutes(),now.getSeconds()), tz_string).format();
  }
}

module.exports = {
  Helper
}
