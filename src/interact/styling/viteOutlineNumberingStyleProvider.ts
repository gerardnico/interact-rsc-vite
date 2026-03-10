import type {Plugin} from 'vite';
import type {InteractConfigType} from "../config/configHandler.js";


export default function viteOutlineNumberingStylesPlugin(interactConfig: InteractConfigType): Plugin {
    // The .css extension on the virtual module ID is the key — it tells Vite to handle the returned string as a CSS stylesheet rather than JavaScript.
    const moduleId = "interact:outline-numbering.css"
    //const resolvedId = "\0" + moduleId
    const resolvedId = moduleId;
    return {
        name: "outline-numbering",
        resolveId(id) {
            if (id === moduleId) return resolvedId
        },
        load(id) {
            if (id !== resolvedId) {
                return null;
            }
            let outlineNumbering = interactConfig.outline.numbering;
            if (!outlineNumbering.enabled) {
                return null;
            }
            const mainContainerSelector = "#main-content"
            const tocSelector = ".toc"

            const level2CounterStyle = outlineNumbering.counterStyleLevel2
            const level3CounterStyle = outlineNumbering.counterStyleLevel3
            const level4CounterStyle = outlineNumbering.counterStyleLevel4
            const level5CounterStyle = outlineNumbering.counterStyleLevel5
            const level6CounterStyle = outlineNumbering.counterStyleLevel6
            const suffix = outlineNumbering.suffix
            const counterSeparator = outlineNumbering.counterSeparator

            const headingNumbering = `
${mainContainerSelector} {
  counter-reset: cnt-h2;
}

${mainContainerSelector} > h2 { counter-reset: cnt-h3; }
${mainContainerSelector} > h3 { counter-reset: cnt-h4; }
${mainContainerSelector} > h4 { counter-reset: cnt-h5; }
${mainContainerSelector} > h5 { counter-reset: cnt-h6; }

${mainContainerSelector} > h2::before {
  counter-increment: cnt-h2;
  content: counter(cnt-h2,${level2CounterStyle}) "${suffix}\\A";
}

${mainContainerSelector} > h3::before {
  counter-increment: cnt-h3;
  content: counter(cnt-h2,${level2CounterStyle}) "${counterSeparator}" counter(cnt-h3,${level3CounterStyle}) "${suffix}\\A";
}

${mainContainerSelector} > h4::before {
  counter-increment: cnt-h4;
  content: counter(cnt-h2, ${level2CounterStyle}) "${counterSeparator}" counter(cnt-h3,${level3CounterStyle}) "${counterSeparator}" counter(cnt-h4,${level4CounterStyle}) "${suffix}\\A";
}

${mainContainerSelector} > h5::before {
  counter-increment: cnt-h5;
  content: counter(cnt-h2, ${level2CounterStyle}) "${counterSeparator}" counter(cnt-h3,${level3CounterStyle}) "${counterSeparator}" counter(cnt-h4,${level4CounterStyle}) "${counterSeparator}" counter(cnt-h5,${level5CounterStyle}) "${suffix}\\A";
}

${mainContainerSelector} > h6::before {
  counter-increment: cnt-h6;
  content: counter(cnt-h2, ${level2CounterStyle}) "${counterSeparator}" counter(cnt-h3,${level3CounterStyle}) "${counterSeparator}" counter(cnt-h4,${level4CounterStyle}) "${counterSeparator}" counter(cnt-h5,${level5CounterStyle}) "${counterSeparator}" counter(cnt-h6,${level6CounterStyle}) "${suffix}\\A";
}
`

            const tocNumbering = `
body {
  counter-reset: cnt-toc2;
}
${tocSelector} ul li {
    counter-increment: cnt-toc2;
}

${tocSelector} ul li li {
    counter-increment: cnt-toc3;
}

${tocSelector} ul li li li {
    counter-increment: cnt-toc4;
}

${tocSelector} ul li li li li {
    counter-increment: cnt-toc5;
}

${tocSelector} ul li li li li li {
    counter-increment: cnt-toc6;
}

${tocSelector} ul li a::before {
    content: "" counter(cnt-toc2, decimal) "${suffix}\\A";
}

${tocSelector} ul li li a::before {
    content: "" counter(cnt-toc2, ${level2CounterStyle}) "${counterSeparator}" counter(cnt-toc3, ${level3CounterStyle}) "${suffix}\\A";
}

${tocSelector} ul li li li a::before {
    content: "" counter(cnt-toc2, ${level2CounterStyle}) "${counterSeparator}" counter(cnt-toc3, ${level3CounterStyle}) "${counterSeparator}" counter(cnt-toc4, ${level4CounterStyle}) "${suffix}\\A";
}

${tocSelector} ul li li li li a::before {
    content: "" counter(cnt-toc2, ${level2CounterStyle}) "${counterSeparator}" counter(cnt-toc3, ${level3CounterStyle}) "${counterSeparator}" counter(cnt-toc4, ${level4CounterStyle}) "${counterSeparator}" counter(cnt-toc5, ${level5CounterStyle}) "${suffix}\\A";
}

${tocSelector} ul li li li li li a::before {
    content: "" counter(cnt-toc2, ${level2CounterStyle}) "${counterSeparator}" counter(cnt-toc3, ${level3CounterStyle}) "${counterSeparator}" counter(cnt-toc4, ${level4CounterStyle}) "${counterSeparator}" counter(cnt-toc5, ${level5CounterStyle}) "${counterSeparator}" counter(cnt-toc6, ${level6CounterStyle}) "${suffix}\\A";
}`

            return `
${headingNumbering}
${tocNumbering}
`
        }
    }
}