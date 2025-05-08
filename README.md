
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

List-view or icons-view. Drag-and-drop organization. Item quick-search. Renaming things.

<br/>

## Quick-start OPFS file browser

Quay is a toolkit that can be used in many different ways.  
In this section, several different intergration examples are provided.  

### HTML Technique
1. Install the script into your html `<head>`:
    ```html
    <script type="module">
      import {QuayOpfs, register} from "https://quay.e280.org/install.bundle.min.js"
      const quay = new QuayOpfs({allow: ["/"]})
      register(quay.components())
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
    import {QuayOpfs, register} from "@e280/quay"
    const quay = new QuayOpfs({allow: ["/"]})
    register(quay.components())
    ```
1. Place the outliner component anywhere in your html `<body>`:
    ```html
    <quay-outliner></quay-outliner>
    ```
1. It's ready, take it for a spin!

