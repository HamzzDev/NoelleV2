import { writeFile, unlink } from 'fs/promises'

import { tmpdir } from 'os'

import { join } from 'path'

import FormData from 'form-data'

import axios from 'axios'

import { fileTypeFromBuffer } from 'file-type'

import fs from 'fs'

export default async function uploadToCatbox(buffer) {

    let { ext } = await fileTypeFromBuffer(buffer);

    let tmpFile = join(tmpdir(), `catbox-${Date.now()}.${ext}`);

    

    await writeFile(tmpFile, buffer); // simpan sementara

    const form = new FormData();

    form.append("fileToUpload", fs.createReadStream(tmpFile)); // gunakan stream

    form.append("reqtype", "fileupload");

    const res = await axios.post("https://catbox.moe/user/api.php", form, {

        headers: form.getHeaders()

    });

    await unlink(tmpFile); // hapus file setelah upload

    return res.data; // langsung URL

}