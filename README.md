![Chrome GitHub Editor Logo](app/images/icon-48.png) chrome-github-editor
========================

Chrome extension to add editor buttons to every comment input on GitHub.

[![Available in the Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_206x58.png)](https://chrome.google.com/webstore/detail/github-comment-editor/knifdnebmefnkimmiegaidobmomoalpp)

Supported features and hotkeys:

- Bold (`CTRL+B`/`⌘+B`)
- Italic (`CTRL+I`/`⌘+I`)
- Strikethrough (`CTRL+S`/`⌘+S`)
- Heading 1 (`ALT+1`)
- Heading 2 (`ALT+2`)
- Heading 3 (`ALT+3`)
- Quote (`CTRL+Q`/`⌘+Q`)
- Code (`CTRL+D`/`⌘+D`)
- Link tag (`CTRL+K`/`⌘+K`)
- Image tag (`CTRL+M`/`⌘+M`)
- Unordered list (`CTRL+U`/`⌘+U`)
- Ordered list (`CTRL+O`/`⌘+O`)
- Check list (`CTRL+H`/`⌘+H`)
- Horizontal rule (`CTRL+L`/`⌘+L`)

![Chrome GitHub Editor Screenshot](raw/screenshot-2.png)

##Development

You need to have NodeJS with `grunt-cli` and `bower` installed. You also need Ruby in order to compile SCSS files.

```shell
$ npm install -g grunt-cli bower
$ npm install
$ bower install
$ gem install compass
```

To debug the application with a live reload mechanism, run:

```shell
$ grunt debug
```

Then add the `app` folder as an unpackaged extension in Chrome. That's all.

##Credits

This extension uses the following libraries and resources:

* [jquery](http://jquery.com/)
* [jquery.hotkeys](https://github.com/jeresig/jquery.hotkeys)
* [font-awesome](http://fortawesome.github.io/Font-Awesome/)
* [Code icon](http://thenounproject.com/term/code/18033/) by Azis from The Noun Project

##License

```
   Copyright 2014-2015 Francesco Pontillo and Sebastiano Poggi

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

```
