import dateFormat from 'dateformat';
//wrap long content to a short one
export function wrap(content) {
  if (content.length < 6) {
    return content;
  }
  let start = content.substring(0,4);
  let end = content.substring(content.length - 6, content.length);
  return start + "..." + end;
}

export function multiline(content, lines) {
  let eachLine = content.length / lines;
  let start = content.substring(0,eachLine) + "\n";
  for (var i =1; i < lines -1; ++i) {
    start += content.substring(i * eachLine, )
  }

  start += content.substring((lines - 1) * eachLine, content.length);

  return start;
}

export function formatQuantity(quantity) {
   let  formated =  parseInt(quantity)/100000000;
   return formated.toFixed(4);
}

export function formatFee(quantity) {
  let  formated =  parseInt(quantity)/100000000;
  return formated.toFixed(4);
}

export function formatToken(quantity) {
  let  formated =  parseInt(toFixed(quantity))/100000000;
  return formated.toFixed(2);
}

export function formatPrice(quantity) {
  let  formated =  parseInt(quantity)/100000000;
  return formated.toFixed(4);
}
function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}

export function formatTime(timestamp) {
  //var date = new Date(timestamp * 1000);
 // return dateFormat(date, 'yy-mm-dd HH:MM:ss');
   return timestamp;
}

export function txType2String(type, subType) {

  if (type == "TRANSFER") {
    return "transaction.transfer";
  }  else if (type == "ISSUE_TOKEN") {
    return "transaction.assetIssue"
  } else if (type == "TRANSFER_OWNERSHIP") {
    return "transaction.transferOwnership"
  } else if (type == "MINT_TOKEN") {
    return "transaction.mintToken"
  } else if (type == "CREATE_MARKET") {
    return "transaction.createMarket"
  } else if (type == "CANCEL_MARKET") {
    return "transaction.cancelMarket"
  } else if (type == "CREATE_ORDER") {
    return "transaction.createOrder"
  } else if (type == "CANCEL_ORDER") {
    return "transaction.cancelOrder"
  }

}