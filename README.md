
# 🏗️ Work In Progress
> This project is under construction. It's not finished.  
> The install instructions probably won't work yet.  

---
---

<br/><br/>

<div align="center"><img alt="" width=256 src="https://i.imgur.com/tranhbs.png"/></div>

# 🪝 Quay
> Outliner UI for the web — files, folders, layers, etc

**Quay** is a outliner ui for the web. It provides a good user experience for interacting with files, folders, layers — any nested tree.

List-view or icons-view. Reorganize with drag-and-drop. Quick-search. Renaming things. Dropping files.

<br/>

## Quick-start OPFS file browser

Quay is a toolkit that can be used in many different ways.  
In this section, several different intergration examples are provided.  

### HTML technique
1. Install the script into your html `<head>`:
    ```html
    <script type="module">
      import * as Quay from "https://quay.e280.org/install.bundle.min.js"
      const opfs = new Quay.Opfs({allow: ["/"]})
      Quay.register(opfs.components())
    </script>
    ```
1. Place the outliner component anywhere in your html `<body>`:
    ```html
    <quay-outliner></quay-outliner>
    ```
1. Now you're done! Try it out, upload some files and play around.

### Web dev technique
1. Install the package into your project:
    ```sh
    npm i @e280/quay
    ```
1. Put this code into your js/ts app entrypoint (like "main.ts" or something):
    ```ts
    import * as Quay from "@e280/quay"
    const opfs = new Quay.Opfs({allow: ["/"]})
    Quay.register(opfs.components())
    ```
1. Place the outliner component anywhere in your html `<body>`:
    ```html
    <quay-outliner></quay-outliner>
    ```
1. It's ready, take it for a spin!

<br/>

## Hands-on custom integration

```ts
import * as Quay from "@e280/quay"

const file = Quay.make.item({icon: "file", label: "My cool file"})
const folder = Quay.make.folder({children: [file.id]})

const brain = new Quay.Brain({
  state: new Quay.State({
    rootId: folder.id,
    items: [folder, file],
  }),

  icons: Quay.icons.standard,
  theme: Quay.themes.standard,
  contextMenu: Quay.contextMenu.standard,

  permissions: Quay.permissions.all,
  allowSearch: true,
  allowManualSorting: true,
  allowRefresh: true,

  onNewFolder: async folder => {},
  onMove: async move => {},
  onSearch: async search => {},
  onDelete: async del => {},
  onRename: async rename => {},
  onRefresh: async rename => {},
  onDragAndDrop: async dnd => {},
  onDrop: async drop => {},
})

Quay.register(brain.components())
```

