const Helpers = {

  sortObjectsByKey: (array, key, direction) => {
    array.sort((a, b) => {
      if (a[key] > b[key]) {
        return direction;
      }
      if (a[key] < b[key]) {
        return direction * -1;
      }
      return 0
    })
  }

}

export default Helpers;
