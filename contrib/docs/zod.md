## v3 vs v4

https://github.com/shadcn-ui/ui/blob/68a69d81f7de95a9fa2e83c16486771e37252ff3/packages/shadcn/package.json#L115

to avoid conflict between v3 shadcn and v4 (our code) that go us this error (looseObject is v4 only)

```text
R.looseObject is not a function
```

Don't use:

* v4 only function: https://zod.dev/v4/changelog?id=deprecates-strict-and-passthrough such as:
  * looseObject
  * strictObject
* all zod should be imported as zod

```javascript
// not zod/v4 -> in zod v3
import {z} from 'zod/v4';
// but
import {z} from 'zod';
```