exports.transformMessage = (notification) => {
  let res = notification.message;
  const message = notification.message.toLowerCase();

  // If the text has the word “sale” in it, should append “!”
  // at the end of the notification text message
  if (message.includes("sale") && !message.includes("!")) {
    res = notification.message.concat("!");
  }

  // If the text has the word “new” in it, should append “~~”
  // at the start and of the notification text message
  if (message.includes("new") && !message.includes("~~")) {
    res = "~~" + notification.message;
  }

  // If the text has the words “limited edition” in it,
  // should change those words to all caps for the notification text message
  if (message.includes("limited edition")) {
    const array = message.split(" ");
    const transformedArray = array.map((item) =>
      item === "limited" || item === "edition" ? item.toUpperCase() : item
    );
    res = transformedArray.join(" ");
  }

  return res;
};
