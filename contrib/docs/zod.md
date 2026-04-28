

to avoid conflict between v3 shadcn and v4 (our code) that go us this error (looseObject is v4 only)
```text
R.looseObject is not a function
```
all zod should be imported as v4
```javascript
// not
import {z} from 'zod';
// but
import {z} from 'zod/v4';
```