import Icon from "@/components/interact/Icon";
import Raster from "@/components/interact/Raster";


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