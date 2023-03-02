## @fgsreally/rollback

provide `rollback` scoped with typescript

```ts
import {scope} from '@fgsreally/rollback'

await scope(async (r) => {

  await r(() => /**do sth */, fn);

});
```
