import { NextResponse } from "next/server";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const dirPath = join(process.cwd(), "public/themes");
  const files = readdirSync(dirPath).filter((f) => f.endsWith(".css"));

  const themeList = files.map((file) => {
    const name = file.replace(".css", "");
    const content = readFileSync(join(dirPath, file), "utf-8");

    // Extract common theme colors from CSS variables
    const colors = [];
    const regex =
      /--(?:text-pri|bg-color|sub-alt-color):\s*(#[a-fA-F0-9]{3,6})/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      colors.push(match[1]);
    }

    // Ensure exactly 3 swatches for each theme
    while (colors.length < 3) {
      colors.push("#ccc"); // fallback color
    }

    return {
      name,
      colors: colors.slice(0, 3),
    };
  });

  return NextResponse.json(themeList);
}
