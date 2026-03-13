/**
 * Svg Override (used so that TypeScript on import of svg file)
 * As explained here: https://vite.dev/guide/features#client-types
 * To override the default typing, add a type definition file that contains your typings.
 * Then, add the type reference before vite/client.
 */
declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    // @ts-ignore - does not worl as explained
    export default content
}
