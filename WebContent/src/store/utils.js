/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
function newIdOfArray(array) {
  return Math.max.apply(Math, array.map(a => a.id)) + 1
}

function log(message) {
  return console.log.apply(console, [message]);
}

function currentDateTime() {
  // return datetime in format of '2017-4-28 13:2:15'
  let currentDate = new Date();
  return currentDate.getFullYear() + "-"
    + (currentDate.getMonth() + 1) + "-"
    + currentDate.getDate() + " "
    + currentDate.getHours() + ":"
    + currentDate.getMinutes() + ":"
    + currentDate.getSeconds();
}

export {newIdOfArray, currentDateTime, log};