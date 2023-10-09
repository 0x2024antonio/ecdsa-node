const fs = require("fs").promises;
const path = require("path");

const exists = async (f) => {
  try {
    await fs.stat(f);
    return true;
  } catch {
    return false;
  }
};

const main = async () => {
  const fileName = "keys.txt";
  const filePath = path.join(__dirname, fileName);
  const fileExists = await exists(filePath);

  if (fileExists) {
    const data = await fs.readFile(filePath, "utf8");
    const obj = JSON.parse(data);
    obj.forEach((element) => {
      console.log(element);
    });
  } else {
    console.log(`${filePath} does not exist.`);
    console.log("Please run testGenerateEthAddress first.");
  }
};

main();
