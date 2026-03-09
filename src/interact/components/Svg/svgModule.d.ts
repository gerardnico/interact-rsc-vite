/**
 * Svg Override (used so that TypeScript on import of svg file)
 * https://vite.dev/guide/features#client-types
 */
declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
}
