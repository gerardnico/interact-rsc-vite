## Image Component

All attribute of [the service](#image-service-parameters) plus the following:

| Name        | Possible values                     | Description                                               |
|-------------|-------------------------------------|-----------------------------------------------------------|
| Type        | `fluid`, `none`                     | The type of image to apply dedicated styling              |
| Width       | Integer                             | The requested width in pixel                              |
| Height      | Integer                             | The requested height in pixel                             |
| Ratio       | `width:height`                      | The requested ratio (Example: `16:9`)                     |
| Compression | `low`, `mid`, `high`, `max`, `none` | A compression preset for raster image (default to `high`) |

* A `fluid` image will scale down to fit the container, maintaining the aspect ratio.

## Features

* No image stretch: final width and height values never go above the image intrinsic size.
* Automatic compression
* Responsive by default
* Ratio support
* Fallback image

## Error handling

### Image Component Error

Example of image component error

In case of a bad input in the image component:

* the default fallback image is show en with the error title
* and the image description (`alt` attribute) get the exact error.

Example of Image that will show an error:

```mdxjs
<Image src={"card_puncher_data_processing.jpg"}
       alt={"Card Puncher"}
       width={-1}
/>
```

* For a image error that is created by:

### Transformation Service Error

In case of error, the transformation service will:

* send back the default fallback image
* with the exact error in the http headers `X-Interact-Image-Handler-Error`

Example of `img` element that will show an error:

```html
<img src="_images/does-not-exist.jpg" alt=""/>
```

## Responsive Image

### Dpi Correction

Mobile have a higher DPI and can then fit a bigger image on a smaller size.

You can enable DPI correction for responsive image.

This can be disturbing when debugging responsive sizing image
If you want also to use less bandwidth, this is also useful.