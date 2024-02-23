import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
export async function POST(request: Request) {
  const formData = await request.formData();

  const files = formData.getAll("file");
  let results: Array<any> = [];
  if (files.length > 0) {
    const filePromises = files.map(async (file) => {
      if (!(file instanceof File)) {
        throw new Error("One of the entries is not a file.");
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name.replace(/\s+/g, "_");

      try {
        await writeFile(
          path.join(process.cwd(), "public/uploads", filename),
          buffer
        );
        return `/public/uploads/${filename}`;
      } catch (error) {
        console.error("Error occurred with file:", filename, error);
      }
    });

    results = await Promise.allSettled(filePromises);
  }
  return NextResponse.json({ data: results });
}
