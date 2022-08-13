'use strict';

class Utils {

  static checkResponseSize(data) {
    if(data.length < 3){
      return false;
    }
    return true;
  }
}

module.exports = Utils;
