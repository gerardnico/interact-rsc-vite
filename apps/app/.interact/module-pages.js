import * as Page0 from "apps/app/pages/index.mdx";
import * as Page1 from "apps/app/pages/counter.mdx";
import * as Page2 from "apps/app/pages/yolo/yolo.mdx";

export const modulePages = {
    "/": Page0,
    "/index": Page0,
    "/counter": Page1,
    "/yolo/yolo": Page2
};

export function getModulePage({ path, notFoundPath }) {
    return modulePages[path] ?? (notFoundPath ? modulePages[notFoundPath] : undefined);
}

export default getModulePage;