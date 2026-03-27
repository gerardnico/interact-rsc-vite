---
title: Image
---


<Image src="card_puncher_data_processing.jpg" alt="Card Puncher" height="300" ratio="16:9"/>


## Image Component

| Name   | Default | Possible values  | Description                                                    |
|--------|---------|------------------|----------------------------------------------------------------|
| Type   | `fluid` | `fluid`, `none`  | The type of image to apply dedicated styling                   |
| Width  |         | Positive Integer | The requested width in pixel                                   |
| Height |         | Postiive Integer | The requested height in pixel                                  |
| Ratio  |         | `number:number`  | The requested ratio (Most common: `21:9`,`16:9`, `4:3`, `1:1`) |

## Transformation Properties

| Name        | Default | Possible values                                 | Description                                                  |
|-------------|---------|-------------------------------------------------|--------------------------------------------------------------|
| Fit         | `cover` | `cover`, `contain`, `fill`, `inside`, `outside` | How the image should fit the box defined by width and height |
| Compression | `mid`   | `low`, `mid`, `high`, `max`, `none`             | A compression preset for raster image                        |

More:

* A `fluid` image will scale down to fit the container, maintaining the aspect ratio.
* [Fit explanation](https://sharp.pixelplumbing.com/api-resize/#resize)

## Features

* No image stretch: final width and height values never go above the image intrinsic size.
* Automatic compression
* Responsive by default
* Ratio support
* Fallback image
* Crop support with fit attribute

## Error handling

### Image Component Error

Example of image component error

In case of a bad input in the image component:

* the default fallback image is shown en with the error title
* and the image description (`alt` attribute) get the exact error.

Example of Image that will show an error:

```markdown
<Image src="card_puncher_data_processing.jpg"
alt="Card Puncher"
width="-1"
/>
```


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

## Compression

| Level | Quality Level | Description                                                                                          |
|-------|---------------|------------------------------------------------------------------------------------------------------|
| none  |               | No compression applied; original image data is preserved exactly as-is                               |
| low   | 90            | Minimal compression with negligible quality loss; best for archival or print use                     |
| mid   | 80            | Balanced compression reducing file size by ~50% with minimal visible quality impact                  |
| high  | 60            | Aggressive compression prioritizing small file size over image fidelity                              |
| max   | 40            | Maximum compression; significantly reduced quality, optimized for bandwidth-constrained environments |
