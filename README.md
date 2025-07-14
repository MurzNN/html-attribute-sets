# HTML Attribute Sets

A JS library to describe directly in HTML and swap HTML tag attributes (CSS
styles, data attributes, etc), without managing custom JavaScript code for each
case.

## The problem

When you create a responsive design in HTML and CSS, pretty often, some
components should look and behave differently depending on the device type. For
example, several blocks with text should look like tabs on desktop and as an
accordion on mobile.

The easiest and the most popular approach to implement this is to put this
component twice into the HTML code and use the `display: none` CSS approach to
hide one of the duplicates from displaying per device.

**But is that approach good? No!** You make the same HTML code present on the
page twice! Search engines will not be happy with this! And page size and load
time - too.

## The solution

**The right approach** is just to reuse the same HTML structure for all the
device types, and just toggle CSS classes in it to make it look different per
device type.

To resolve this task, I created a JS library that automates this feature, which
makes swapping HTML tag classes and attributes easy and automatic, and even
without any custom JS code!

All that you need to do is to add an attribute `data-attr-sets` with the list of
classes per breakpoint (device type).

## Demo

You can see the functionality in action on the [demo page
»](https://murznn.github.io/html-attribute-sets/examples/index.html)

## Usage

1. Add a library to the webpage using the CDN:
```html
<script src="//cdn.jsdelivr.net/gh/MurzNN/html-attribute-sets@v0.1/dist/browser/min/index.js" type="module"></script>
```
or any other approach.

2. And just describe needed class sets per breakpoint in the HTML attribute of
   the needed tag, here is an example:
```html
<div data-attr-sets='{
  "sm-": "btn btn-primary",
  "md": "btn btn-secondary",
  "lg+": "btn btn-success"
}'>My button</div>
```
This is just a simplified example based on Bootstrap breakpoints and classes,
which makes the button colored blue for mobile devices, gray for tablet, and
green for desktop.

Actually, the library doesn't depend on Bootstrap, you can use it with any
frontend framework and any breakpoints.

To automate triggering the attributes swap on the breakpoint change, you can use
any approach that you want.

## Example

Here is a more detailed example of a component that is represented as dropdowns
for all breakpoints more than "md" and as accordion for "sm" and less, and uses
the (breakpoints-js)[https://github.com/thecreation/breakpoints-js] library to
trigger swapping when the breakpoint changes.
```html
<div id="my-responsive-component" data-attr-sets='{"sm-":"accordion","md+":""}'>
  <div data-attr-sets='{"sm-":"accordion-item","md+":"dropdown"}'>
    <button data-attr-sets='{"sm-":{"class":"accordion-header accordion-button collapsed","data-bs-toggle":"collapse"},"md+":{"class":"btn btn-outline-primary dropdown-toggle","data-bs-toggle":"dropdown"}}' type="button" data-bs-parent="#my-responsive-component" data-bs-target="#my-item-1-body">Header 1</button>
      <div data-attr-sets='{"sm-":"accordion-body collapse","md+":"dropdown-menu"}' id="my-item-1-body" data-bs-parent="#my-responsive-component">Body 1</div>
  </div>
  <div data-attr-sets='{"sm-":"accordion-item","md+":"dropdown"}'>
    <button data-attr-sets='{"sm-":{"class":"accordion-header accordion-button collapsed","data-bs-toggle":"collapse"},"md+":{"class":"btn btn-outline-primary dropdown-toggle","data-bs-toggle":"dropdown"}}' type="button" data-bs-parent="#my-responsive-component" data-bs-target="#my-item-2-body">Header 2</button>
      <div data-attr-sets='{"sm-":"accordion-body collapse","md+":"dropdown-menu"}' id="my-item-2-body" data-bs-parent="#my-responsive-component">Body 2</div>
  </div>
</div>
```
and a JS library initialization:
```js
<script
  src="//cdn.jsdelivr.net/npm/breakpoints-js@1/dist/breakpoints.min.js:"
  type="module"
></script>
<script>
// Initialize the Breakpoints library.
Breakpoints();

// Get the list of available breakpoints.
const breakpointsList = Breakpoints.all();

// Set initial classes on the element load.
AttributeSetApply({
  set: Breakpoints.current().name,
  setsList: breakpointsList
});

// Apply attributes on changing the breakpoint.
Breakpoints.on('change', function () {
  AttributeSetApply({
    set: this.current.name,
    setsList: breakpointsList
  });
});
```
