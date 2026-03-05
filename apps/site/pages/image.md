## Image Attribute

All attribute of [the service](#image-service-parameters) plus the following:

| Name                | Possible values | Description                             |
|---------------------|-----------------|-----------------------------------------|
| ResponsiveBehaviour | `fluid`, `none` | `none` disable the responsive behaviour |

## Image Service Parameters

| Name        | Alias | Possible values                     | Description                                               |
|-------------|-------|-------------------------------------|-----------------------------------------------------------|
| Width       | w     | Integer                             | The requested width                                       |
| Height      | h     | Integer                             | The requested height                                      |
| Ratio       | r     | `width:height`                      | The requested ratio (Example: `16:9`)                     |
| Compression | c     | `low`, `mid`, `high`, `max`, `none` | A compression preset for raster image (default to `high`) |

## Features

* No image stretch: final width and height values never go above the image intrinsic size.

## Fallback image

```mdxjs
<Image src={"card_puncher_data_processing.jpg"}
       alt={"Card Puncher"}
       width={-1}
/>
```