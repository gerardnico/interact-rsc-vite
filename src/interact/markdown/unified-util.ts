/**
 * Remove the part of public in a href or src path
 * And returns an absolute path if absolute is true
 *
 * Img path should be absolute
 * While Anchor link should not
 * @param publicDirName - the name of the public directory
 * @param relativePath - the relative path
 * @param absolute = return an absolute path if true
 */
export function removePublicPart({relativePath, publicDirName = "public", absolute = false}: {
    relativePath: string,
    publicDirName?: string,
    absolute?: boolean
}): string {
    let searchString = `/${publicDirName}/`;
    const publicIndex = relativePath.indexOf(searchString)

    if (publicIndex == -1) {
        return relativePath
    }
    let sliceStart = publicIndex + searchString.length;
    if (absolute) {
        // keep also the separator character
        sliceStart -= 1
    }
    return relativePath.slice(sliceStart);
}