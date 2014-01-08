Lazy loading listview for jQuery Mobile
=======================================
What is it
----------
A lightweight jQuery Mobile Plug-in that applies the listview Plug-in and 
automatically adds a "more" button which load more items with ajax.
How to use
----------
Put *jquery.mobile.lazylist.js* and *jquery.mobile.lazylist.css* into your jQuery Mobile application like
you would do with any other plugin.
You can then easily add the data-role "lazylist" to any ul Element and make it an lazy loading list.

```html
<ul data-role="lazylist">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <li>Item 4</li>
  <li>Item 5</li>
  <li>Item 6</li>
  <li>Item 7</li>
  <li><div class="lazylist-morebtn" data-lazylist-moreurl="load_more_from_this_url.html">More ...</div></li>
</ul>
```
When an anchor element with class *lazylist-morebtn* is present, it will load the content
form the url specified by *data-lazylist-moreurl* and append it to the list. So the url must
return a html snippet with *<li>* elements. If this snippet contains another
*lazylist-morebtn* you can load even more *<li>* elements.
