# Svg

## Usage

### Programmatic Page

In a [programmatic page](jsx-tsx-page.mdx), importing a svg will return
a [React Svg Component](https://react-svgr.com/docs/what-is-svgr/)

Example:
````javascript
import Arrow from "../images/arrow-right-circle.svg"

export default function svgPage() {
    return (
        <Arrow width={10}/>
    )
}
````