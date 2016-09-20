# Testing API extension for visual code

Testing API is a extension for visual code which is easy to use and trace history. It help you make testcases for automation test when you use the below link [https://github.com/just4developments/api-testing]

## Main Features

1. Send HTTP request in editor and view response in a separate pane with syntax highlight
2. Auto save and view request history
3. Code snippets for operations like GET and POST...
3. Make testcases when you combine with the project  [https://github.com/just4developments/api-testing]

Note: 
* You can run api in a part of content by select it and run.
* If you select nothing, it will run content in editor.

### Some snippets

1. api.get : Generate client request by GET method
2. Same for POST, PUT, HEAD, DELETE method
4. ...

> Tip: Please type `api.` to get snippets. Add `des` attribute to describe api in history

### Quick command

* `Alt + Enter` : Run api in a window
* `Ctr + Alt + Enter`: Run api then open new window
* `Ctrl + Shift + P` then type `API History`: Show Api history

## Example
```
{
  des: 'option which show in history',
  method: 'GET',
  url: 'http://localhost.com'
}
```

## Install

Press F1, type `ext install testing-api`

## Extension Settings

This extension contributes the following settings:

* `history.maxStored`: Max num of history can be stored.(Default is 100)

## Release Notes

### 0.0.3

* Update document, snippets

### 0.0.2

* Fix upload file error

### 0.0.1

* Optimize performance
* Update snippets

### 0.0.0

Initial release of Testing API

-----------------------------------------------------------------------------------------------------------

## Working with visual code

**Note:** Here are some useful editor keyboard shortcuts:

* `Alt + Enter` : Run api in a window
* `Ctr + Alt + Enter`: Run api and open new window
* `Ctrl + Shift + P` then type `API History`: Show Api history

**Enjoy!**