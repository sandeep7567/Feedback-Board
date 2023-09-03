import { join } from "path";
import { writeFile } from "fs/promises";

import { cloudinaryConnect } from "@/app/config/cloudinary";
import { uploadImageToCloudinary } from "@/app/utils/imageUploader";

export const POST = async(req) => {

  // cloudinary upload
  cloudinaryConnect();

  const formData = await req.formData();

  const links = [];

  for (const fileInfo of formData) {
    const file = fileInfo[1]
    // console.log(file);

    if (!file) {
    return Response.json({ success: false })
    };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = join('/', 'tmp', file.name)
    await writeFile(path, buffer);

    const fileData = await uploadImageToCloudinary(
      path,
      process.env.FOLDER_NAME
    );

    // console.log(fileData.secure_url);
    const { secure_url } = fileData;
    
    links.push(secure_url);
    // console.log(`open ${path} to see uploaded pic`);
  };

  // console.log("data", data)

  return Response.json(links)
};