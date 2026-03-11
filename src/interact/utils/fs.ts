import { readFile } from "fs/promises";

export async function fsGetTextAsync(path:string) {
    try {
        return await readFile(path, "utf8");
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === "ENOENT") {
            return null; // file does not exist
        }
        throw err;
    }
}