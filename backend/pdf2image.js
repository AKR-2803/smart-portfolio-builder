import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pdf from 'pdf-poppler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// def pdf2image function
export default async function pdf2image(inputFileName, outputFolderName = 'output') {
    const inputFile = path.join(__dirname, 'uploads', inputFileName);
    const outputDir = path.join(__dirname, outputFolderName, inputFileName);

    // create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const opts = {
        format: 'jpeg',
        out_dir: outputDir,
        out_prefix: 'page',
        page: null, // all pages
    };

    try {
        await pdf.convert(inputFile, opts);
        console.log('PDF conversion completed successfully');
    } catch (error) {
        console.error('Error converting PDF:', error);
        throw error;
    }

    return outputDir;
}
