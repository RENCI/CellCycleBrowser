function find(array, key, value) {
 for (var i = 0; i < array.length; i++) {
   if (array[i][key] === value) return array[i];
 }

 return null;
}

module.exports = {
  find: find
}
