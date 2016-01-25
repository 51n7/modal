## A Modal Component

This is a simple responsive modal library built with vanilla JS and utilizing [Hogan.js](http://twitter.github.io/hogan.js/) for dynamic content templating.

## Usage

Include the library and then build the Modal object with the options below.

```
<script src="js/modal.js"></script>
```

```js
var myModal = new Modal({
	title: "I'm a modal window!",
	content: "Lorem ipsum dolor sit amet",
	escapeClose: true,
	buttonClose: true,
	overlayClose: true,
	buttons: [
		{
			type: "success",
			label: "Primary",
			id: "success",
			className: "",
			link: "#success"
		},{
			type: "secondary",
			label: "Secondary"
			...
		}
	]
});

myModal.open();
```

 - __content:__
    - can accept an HTML string or DOM node
 - __escapeClose, buttonClose, overlayClose:__
    - allow the user to close the modal with each option
 - __buttons:__
    - type: success, secondary, warning, error

## Hogan JS

I've included [`hogan.template.js`](https://github.com/twitter/hogan.js/blob/master/lib/template.js) and a pre-compiled template (`hogan.content.js`). To manually create the pre-compiled template:

 - Create a file with the template HTML in it and name it something like "content.hogan".
    - `<p>{{one}} {{two}}</p>`
 - Install Hogan:
    - `$ npm install hogan.js`
 - Run the command below on your template file:
    - `hulk content.hogan`
 - You should get a JS output that looks like the snippet below:

```js
if (!!!templates) var templates = {}; templates["content"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<p>");t.b(t.v(t.f("one",c,p,0)));t.b(" ");t.b(t.v(t.f("two",c,p,0)));t.b(" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ligula massa, bibendum eget lacus tempor, malesuada luctus neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi condimentum suscipit pretium.</p>");return t.fl(); },partials: {}, subs: {  }});
```

 - Copy the output and paste it into a new file, in our case `hogan.content.js`

Once the required files are in place we just need to run the following to get our content, before passing it into the Modal:

```js
var data = {
	one: 'Hello',
	two: 'World'
};
var compiledTemplate = templates['content'];
var renderedTemplate = compiledTemplate.render(data);
console.log(renderedTemplate);
```
