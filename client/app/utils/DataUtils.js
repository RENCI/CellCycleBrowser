module.exports.find = function (array, key, value) {
 for (var i = 0; i < array.length; i++) {
   if (array[i][key] === value) return array[i];
 }

 return null;
}

// Remove non "word" characters
module.exports.removeNonWord = function (s) {
  return s.replace(/\W/g, "");
}
