const fs = require("fs-extra");
const path = require("path");

const sourceDir = path.resolve(__dirname, "../../");
const webDir = path.resolve(__dirname, "../");

async function copyContent() {
  try {
    // Ensure directories exist
    await fs.ensureDir(path.join(webDir, "content"));
    await fs.ensureDir(path.join(webDir, "public/images"));

    // Copy Scripts
    if (await fs.pathExists(path.join(sourceDir, "script"))) {
      console.log("Copying scripts...");
      await fs.copy(
        path.join(sourceDir, "script"),
        path.join(webDir, "content/scripts"),
      );
    }

    // Copy Words
    if (await fs.pathExists(path.join(sourceDir, "words"))) {
      console.log("Copying words...");
      await fs.copy(
        path.join(sourceDir, "words"),
        path.join(webDir, "content/words"),
      );
    }

    // Copy Method
    if (await fs.pathExists(path.join(sourceDir, "method"))) {
      console.log("Copying method...");
      await fs.copy(
        path.join(sourceDir, "method"),
        path.join(webDir, "content/method"),
      );
    }

    // Copy Images
    if (await fs.pathExists(path.join(sourceDir, "images"))) {
      console.log("Copying images...");
      await fs.copy(
        path.join(sourceDir, "images"),
        path.join(webDir, "public/images"),
      );
    }

    console.log("Content copy complete!");
  } catch (err) {
    console.error("Error copying content:", err);
    process.exit(1);
  }
}

copyContent();
