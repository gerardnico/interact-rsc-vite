import Icon from "@combostrap/interact/components/Icon";
import Raster from "@combostrap/interact/components/Raster";


type ImageProps = {

    src: string
    alt: string
    className: string
    width: number
    height: number

}

export default function Image(imageProps: ImageProps) {

    const isSvg = imageProps.src.endsWith('.svg');
    if (isSvg) {
        return <Icon  {...imageProps} />
    }
    return <Raster {...imageProps}/>

}