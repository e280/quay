
# 🛢️ Cask

**Cask** is a turbocharger for reading and writing files in [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system).

It provides high-performance multithreaded low-level read/write access by automatically scheduling parallel tasks across a pool of web workers.

- 📂 **OPFS** — files stay local on the user's device
- 🧵 **Multithreaded** — goes fast with no ui jank
- ⚙️ **Low-level** — streaming byte-level access
- 🔒 **Smart** — prevents funky race conditions

<br/>

---

> ### Wip: implementation plan
> - use comrade for worker pooling
> - workers use opfs createSyncAccessHandle, make TransformStream readable/writable pair, wire it to the file stream, transfer the other end to the main thread, voila, connected
> - we have to do some big-brain horseshit to schedule tasks in a way to maximize parallelism while respecting ongoing locks

