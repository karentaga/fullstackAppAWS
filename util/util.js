import fs from "fs";
import axios from 'axios';
import Jimp from "jimp";
import path from 'path';
import os from 'os';


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
 export async function filterImageFromURL(inputURL) {
    try {
      // original code was giving: "Error: Could not find MIME for Buffer <null>"
      // Using axios to read image
      const response = await axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });

      const photo = await Jimp.read(response.data);

      const fileName = `filtered.${Math.floor(Math.random() * 2000)}.jpg`;

      // using os to test on windows as well
      const outpath = path.join(os.tmpdir(), fileName);

      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .writeAsync(outpath); // Original code was accessing files prematurely

      return outpath;
    } catch (error) {
      reject(error);
    }
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
