
# 🪝 Quay integration

```ts
import {Quay, Opfs, OpfsSchema} from "@e280/quay"

const quay = new Quay()
const opfs = await Opfs.setup()
const group = quay.group<OpfsSchema>(opfs)

register(group.elements())
```

