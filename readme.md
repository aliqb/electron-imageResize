# Image Resizer

Electron application that allows you to select an image and easily change the width and/or height.
It is based on Traversy Media tutorial on [YouTube](https://www.youtube.com/watch?v=ML743nrkMHw&t=1744s&ab_channel=TraversyMedia)
I have done some improvement like maintaining aspect ratio and choosing output path.
[main repo](https://github.com/bradtraversy/image-resizer-electron)

## Usage

Install dependencies:

```bash

npm install
```

Run:

```bash
npm start
```

You can also use `Electronmon` to constantly run and not have to reload after making changes

```bash
npx electronmon .
```
Packaging:

```bash
npm run build
```