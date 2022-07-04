
  const path = "dich";
  const [, objectPath, property] = path.match(/^(.+) ([a-z_]+)$/) || [];
  console.log("object path:", objectPath);
  console.log("property:", property);