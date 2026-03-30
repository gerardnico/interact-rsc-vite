import {getInteractConfig} from "@combostrap/interact/config";


export default function Bootstrap() {
    const interactConfig = getInteractConfig();
    const primary = interactConfig.site.colorPrimary

    const hexToRgb = (hex: string) => {
        // @ts-ignore
        return hex
            .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1)
            .match(/.{2}/g)
            .map(x => parseInt(x, 16))
    }

    const primaryRgb = hexToRgb(primary);
    let style = `
:root {
    --bs-primary: ${primary};
    --bs-primary-rgb: ${primaryRgb};
    --bs-link-color: ${primary};
    --bs-link-color-rgb: ${primaryRgb};
    --bs-body-font-family: "Times New Roman", Times, serif";
}`


    return (
        <>
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
                crossOrigin="anonymous"/>
            <link rel="stylesheet"
                  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"/>
            <style dangerouslySetInnerHTML={{__html: style}}/>
        </>
    )
}