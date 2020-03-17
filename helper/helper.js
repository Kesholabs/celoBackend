export default class helper {
  setTranstype(type) {
    switch (type) {
      case "Deposit":
        return "D" + generateTransID();
      case "Transfer":
        return "T" + generateTransID();
      case "Withdraw":
        return "W" + generateTransID();
      default:
        console.error("Ivalid transaction type %s", type);
        return "ERROR" + generateTransID();
    }
  }
  generateTransID = () => {
    let length = 6;
    let timestamp = +new Date();

    let _getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let ts = timestamp.toString();
    let parts = ts.split("").reverse();
    let id = "";

    for (let i = 0; i < length; ++i) {
      let index = _getRandomInt(0, parts.length - 1);
      id += parts[index];
    }
    return id;
  };
}
