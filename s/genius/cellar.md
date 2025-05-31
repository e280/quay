
# 🪜 Cellar

A virtual filesystem for the web.

Cellar provides primitives for building intuitive file browsing experiences on the web.
- Agnostic about where data is actually stored
- For local, best to use [Cask](./cask.md) as an OPFS turbocharger

> 🤷 **Why not just use OPFS?**  
> OPFS doesn't have cross-browser support for efficient move or rename operations.  
> Cellar is like a souped-up extended opfs.  

Cellar stores two kinds of data:
- **Blob storage**  
  Stores the binary payloads for files.  
  Usually, blob storage will target *opfs* — though localstorage, indexeddb, or cloud storage are options.  
  sha256 hashes are the identifiers, thus binary payloads are thus de-duplicated.  
- **Index storage**  
  Stores metadata and directory hierarchy.  
  Usually, index storage will target *indexeddb* — though localstorage or cloud storage are options.  

<br/>

---

> ### Wip: implementation plan
> - cellar implements the `Twig` interface

