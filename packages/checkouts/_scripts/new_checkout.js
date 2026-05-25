const fs = require("fs");
const path = require("path");
const readline = require("readline");

if (process.env.NODE_ENV === "production") {
  console.error("Error: this script is for development only");
  process.exit(1);
}

const SNAKE_CASE_REGEX = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;

function run(name) {
  if (!SNAKE_CASE_REGEX.test(name)) {
    console.error(
      `Error: "${name}" is not valid snake_case.\n` +
      `  - Must start with a lowercase letter\n` +
      `  - Only lowercase letters, digits, and underscores allowed\n` +
      `  - No leading, trailing, or consecutive underscores`
    );
    process.exit(1);
  }

  const templateDir = path.resolve(__dirname, "../_templates/condominium");
  const targetDir = path.resolve(__dirname, "../src", name);

  if (!fs.existsSync(templateDir)) {
    console.error(`Error: template not found at ${templateDir}`);
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    console.error(`Error: checkout "${name}" already exists at src/${name}`);
    process.exit(1);
  }

  function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        const content = fs.readFileSync(srcPath, "utf-8").replaceAll("CHECKOUT_NAME", name);
        fs.writeFileSync(destPath, content);
      }
    }
  }

  copyDir(templateDir, targetDir);
  console.log(`✅ Created checkout "${name}" at src/${name}`);
  console.log(`   Next steps:`);
  console.log(`   1. Update units in src/${name}/utils/consts.ts`);
  console.log(`   2. Update option labels in src/${name}/components/Address.tsx`);
  console.log(`   3. Run npm run generate:map to register the new checkout`);
}

const argName = process.argv[2];

if (argName) {
  run(argName);
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question("Checkout name (snake_case): ", (answer) => {
    rl.close();
    run(answer.trim());
  });
}
