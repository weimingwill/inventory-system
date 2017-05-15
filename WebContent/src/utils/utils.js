/**
 * Created by zhuang_w-pc on 4/27/2017.
 */
function newIdOfArray(array) {
  return Math.max.apply(Math, array.map(a => a.id)) + 1
}

function log() {
  return console.log.apply(console, arguments);
}

// Dates

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

function getFormatedDate(datetime) {
  return datetime.getFullYear() + "-"
    + (datetime.getMonth() + 1) + "-"
    + datetime.getDate()
}

function getDateRangeOfWeek(date) {
  let mon = date.getDate() - date.getDay() + 1;
  let sun = mon + 6;
  return {
    monday: new Date(date.setDate(mon)),
    sunday: new Date(date.setDate(sun)),
    lastMonday: new Date(date.setDate(mon - 7)),
    lastSunday: new Date(date.setDate(sun - 7))
  }
}

function formatProductName(name) {
  let pieces = name.split(" ");
  for ( let i = 0; i < pieces.length; i++ )
  {
    let j = pieces[i].charAt(0).toUpperCase();
    pieces[i] = j + pieces[i].substr(1).toLowerCase();
  }
  return pieces.join(" ");
}

function getFirstCharOfEachWord(str) {
  let result = "";
  
  str.split(" ").forEach((word) => {
    if (parseInt(word).toString() !== "NaN") {
      result += word;
    } else {
      result += word.charAt(0);
    }
  });
  return result;
}

function dashToCamelCase(str) {
  let parts = str.split("-");
  for (let i = 1; i < parts.length; i++) {
    parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
  }
  return parts.join("");
}

function objectEntries(obj) {
  let index = 0;
  
  // In ES6, you can use strings or symbols as property keys,
  // Reflect.ownKeys() retrieves both
  let propKeys = Reflect.ownKeys(obj);
  
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (index < propKeys.length) {
        let key = propKeys[index];
        index++;
        return { value: [key, obj[key]] };
      } else {
        return { done: true };
      }
    }
  };
}

function removeArrayDuplicates(array) {
  let exist = {};
  return array.filter(a => {
    return exist.hasOwnProperty(a) ? false : (exist[a] = true);
  })
}

function calculateDistance(array1, array2, start, end) {
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += Math.pow(array1[i] - array2[i], 2)
  }
  return sum;
}

function setSameAttributeValues(input, attributes) {
  let output = {};
  Array.from(attributes).forEach(attr => {
    if (input.hasOwnProperty(attr)) {
      output[attr] = input[attr];
    } else {
      output[attr] = ""
    }
  });
  return output;
}

export {
  log,
  newIdOfArray,
  currentDateTime,
  getFormatedDate,
  getDateRangeOfWeek,
  formatProductName,
  getFirstCharOfEachWord,
  dashToCamelCase,
  removeArrayDuplicates,
  calculateDistance,
  setSameAttributeValues
  };