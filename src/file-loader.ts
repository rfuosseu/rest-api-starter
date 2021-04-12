import fs, { Stats } from 'fs';

/**
 * Gets list of files that match an extension
 * @param extension
 * @param folder
 * @returns files
 */
export function getFiles(extension: string, pathDIr: string): string[] {
  const filenames: string[] = fs.readdirSync(pathDIr);

  return filenames.reduce((acc: string[], filename: string) => {
    const fich: Stats = fs.statSync(`${pathDIr}/${filename}`);
    let files: string[] = acc;
    if (fich.isDirectory()) {
      files = files.concat(getFiles(extension, `${pathDIr}/${filename}/`));
    } else if (new RegExp(`${extension}$`).test(filename)) {
      files.push(`${pathDIr}/${filename}`);
    }
    return files;
  }, []);
}

/**
 * Loads file loader
 * @param extension
 * @param folder
 * @returns res
 */
export async function load(extension: string, folder: string): Promise<any[]> {
  const files: string[] = getFiles(extension, folder);

  return (await Promise.all(files.map((file) => import(file)))).map((moduleClass) => Object.values(moduleClass)[0]);
}
