# Chrome extension boilerplate
A boilerplate for Chrome extension with:
- built-in `i18n` support
- `react`
- promisified chrome APIs

## How to

### Create a new extension
1. clone project

`git clone git@github.com:zenoven/chrome-extension-boilerplate.git`

2. run dev command

```
# install packages for the first time
yarn install
# dev
yarn dev
```

### Setup Chrome extensions

1. Open the Extension Management page by navigating to `chrome://extensions`
  - The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the LOAD UNPACKED button and select the extension directory which is `./dist` of the repository.

for more details just visit https://developer.chrome.com/extensions/getstarted#manifest

### Build
```
yarn build
```
now all the dist files are under `./dist` and you can also find the zip file there.

### License
the MIT License.
