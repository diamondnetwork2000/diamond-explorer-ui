import dateFormat from 'dateformat';
//id字段太长，只显示缩略内容
export function wrap(content) {
  if (content.length < 6) {
    return content;
  }
  let start = content.substring(0,4);
  let end = content.substring(content.length - 4, content.length);
  return start + "..." + end;
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
  let  formated =  parseInt(quantity)/1000000;
  return formated.toFixed(2);
}

export function formatTime(timestamp) {
  //var date = new Date(timestamp * 1000);
 // return dateFormat(date, 'yy-mm-dd HH:MM:ss');
   return timestamp;
}

export function txType2String(type, subType) {

  if (type == 0) {
    if (subType == 0) {
      return "transaction.transfer";
    } else {
      return "transaction.batch";
    }
  } else if (type == 2) {
    if (subType == 0) {
      return "transaction.assetIssue"
    } else if (subType == 1) {
      return "transaction.assetTransfer"
    }else if (subType == 2) {
      return "transaction.ask"
    } else if (subType == 3) {
      return "transaction.bid"
    }else if (subType == 4) {
      return "transaction.cancelAsk"
    }else if (subType == 5) {
      return "transaction.cancelBid"
    }
    
  } else if (type == "TRANSFER") {
    return "transaction.transfer";
  }  else if (type == "ISSUE_TOKEN") {
    return "transaction.assetIssue"
  }

}