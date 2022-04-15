exports.transformMessage = (notification) => {
  let res = notification.message;
  const message = notification.message.toLowerCase();
  if (message.includes("sale") && !message.includes("!")) {
    res = notification.message.concat("!");
  }
  if (message.includes("new") && !message.includes("~~")) {
    res = "~~" + notification.message;
  }
  if (message.includes("limited edition")) {
    const array = message.split(" ");
    const transformedArray = array.map((item) =>
    item === "limited" || item === "edition" ? item.toUpperCase() : item
    );
    res = transformedArray.join(" ");
  }
  return res;
};
