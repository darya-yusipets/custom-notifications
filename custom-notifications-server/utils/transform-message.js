const transformMessage = (notification) => {
  const res = message;
  const message = notification.message.toLowerCase();
  if (message.includes("sale") && !message.includes("!")) {
    res = notification.message.concat("!");
  }
  if (message.includes("new") && !message.includes("~~")) {
    res = "~~" + notification.message;
  }
  if (message.includes("limited edition")) {
    const array = message.split(" ");
    const transformedArray = array.map((x) =>
      x === "limited" || x === "edition" ? x.toUpperCase() : x
    );
    res = transformedArray.join(" ");
  }
  return res;
};

module.exports = transformMessage;
