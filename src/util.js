import dateFormat from 'dateformat';
//wrap long content to a short one
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
  let  formated =  parseInt(quantity)/100000000;
  return formated.toFixed(2);
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
  }

}