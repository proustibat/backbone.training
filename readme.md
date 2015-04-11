## Backbone Training

**Hi there.** Welcome to the Backbone Training sessions. Here's a couple of steps that will bring you front-end superpowers. For each step, you'll find a git branch named alike including a solution.

#### before starting, check everything is up and running
* install [nodejs](http://nodejs.org/)
* install [bower](http://bower.io/)
* install [git](http://git-scm.com/)
* git clone `https://bitbucket.org/yamsellem/backbone.training.git`
* install bower dependencies `bower install` in `/public`
* install npm dependencies `npm install` in `/server` and run the server `node server.js`
* access to `index.html` through `http://server:3000`

### step 1: display a static musician list with backbone
**goal:** `index.html` is a static page. You should extract its main content (the musician list within `div.large-12.columns`) into a template (there already are some templates at the bottom of `index.html` declared as `script`). Then, you should use a backbone view to add this template to the target div from which you've extracted it.

* add js imports (`jquery`, `underscore`, `backbone`, `handlebars`) to the `index.html` head
* extract everything in `div.large-12.columns` from html to a template in a `script` tag
* create a backbone view, import the template in it (using its script #id), and display it into the page (providing the div as view.el)

### step 2: fetch the musician list from the server and display it
**goal:** You now have a static template injected in `index.html`. You should make it dynamic. You should use a collection to request the server. Then, when the collection notifies the operation success to the view, you should make the view display each result in its template.

* keep only one block in the template and replace static values with mustaches like `{{name}}`, `{{bio}}` and `{{picture}}`
* compile this template with handlebars in the view
* apply this template to a static object to verify that it works
* create a collection pointing to the url `/musician`
* listen to the collection `sync` event in the view
* iterate over results in the template
* bonus: you may add a modulo 3 on collection iteration

### step 3: add class 'delete' on one musician mouseover
**goal:** You now have a dynamic list of musicians requested from the server. You should make it editable. On mouse over, an icon should appear on one musician at a time to show it can be deleted. On a click, you can delete it from the server and refresh the view.

* to handle individual action on one model of a collection, one view per model is often used, so create a child view for each musician in the collection
* show & hide class `delete` on one musician mouseover (on div `.columns`) with the `events` attribute of this model view
* delete the model on click
* refresh the collection view

### step 4: display a notification on removal (potentially multiple)
**goal:** Every model of the musician collection can be deleted (except for the last one). You should notify the user on success (errors come next).

* create a notification view
* listen to the previous collection removal
* add an alert on `remove` event and hide the alert after a while
* handle multiple alerts (only display one on multiple removal)
* handle a click on the alert cross (×)

### step 5: handle error on last musician deletion
**goal:** The server refuses to delete the last item of the list, you should display an error notification when that happens.

* prevent the last element from being deleted when an error occured
* display a red notification

### step 6: navigate to a new page on click on 'add an artist'
**goal:** The application got its first `page`. You should handle navigation through a router to allow multiple page navigation.

* listen to clicks on 'add on artist', 'login' & main title and `navigate` to a proper url accordingly
* extract every html node between nav and footer in a template
* create a 'layout' view to render this template
* wrap existing view creation in this 'layout' view render method
* create a router and re-render this 'layout' view on each route match using the `routes` attributes

### step 7: create a new musician
**goal:** The application list existing musician, to create new ones, you should display a form and, on submit, add its data to the server.

* create a new view and display the creation form template in it
* capture input values on form submition
* create a new model and save it on the server with those values
* clear inputs after success

### step 8: add a face to this new musician
**goal:** The musician created by the application has no face. You should create a face collection, display it, and collect the last selected value into an hiden input.

* create a collection with view that will fetch `/picture` url and render it
* retain the last selected face using a collection and items views (unselect others views  on click)
* save it with the previous name & bio infos

### step 9: create a login screen
**goal:** Some action may require the user to be logged (musician creation & deletion for instance only work once logged - with a server update). You should create a login form, verify the creadential match and login the user accordingly. Once logged, a cookie is added by the server and automatically sended back by the client. No code required for further requests.

* activate the nodejs authentication route in `server.js`
* create a login view with two templates, login and logged
* create a user model with a fetch url equal to `/user` and a save + delete url equal to `/user/signin`
* fetch the user on each display of the view and display its template accordingly
* handle login & logout on submit

### step 10: handle every errors
**goal:** Only the errors happening in musician collection are handled right now. You should handle every one of them. Instead of giving each collection to the notification view, using an event channel to propagate success and error event is more flexible.

* override backbone sync to handle every errors
* trigger a notification on every errors except on user model errors
* trigger a success notification on every view that use to
* add `animate.css` to bower and shake login submit button on error

### step 11: hunt phantom views
**goal:** You should log every error notification in the console and navigate back and forth between 'pages': something wrong is happening when logout + show home multiple times, right? Views stay subscribed on route change, active objects prevent them to be garbage collected. The same happens to view dom events subscription when an el is given on creation, otherwise Backbone create a div (configurable) for the view and attach events to it.

* hunt phantom views!

### step 12: validate a model
**goal: ** You should validate the musician creation before sending it values to the server.

* validate that musician creation do not use a name of 3 characters or less
* listen to the invalid event and add an `invalid` class around the name input

### step 13: filter collection
**goal:** Instead of listing every musician, it can be convenient to filter them on a category basis. You should add a filter on the collection, and change the url accordingly so that refreshing the page will keep the collection filtered.

* add a [subnav](http://foundation.zurb.com/docs/components/subnav.html) with filters `[All, Floyd, Beatles, Zeppelin]`
* filter the collection when clicking on a criteria
* highlight visually the filter link when selected
* update the browser history on each filter selection, so only the appropriate musicians are displayed when refreshing the page

### step 14: add a tooltip
**goal:** Including external library can often be usefull. You should try with a simple tooltip to see own it can be done.

* add the formstone [tooltip](http://formstone.it/components/tooltip/) dependency to bower
* import its css and js to `index.html`
* add a `Filter musicians by band` tooltip on the `Filter:` title, careful, it should be render after the template has been added to the page

### step 15: split the app with requirejs
**goal:** This step is optionnal, it details the process of adding a module loader to an application and can be repetitive. Cloning the project from the solution and looking at the impact is enough to get a good idea of how it works. Every class is bundled into a file and file can `require` each other and external dependencies. This also works with templates and help to strcture things up.

* add requirejs to bower
* move script imports from `index.html` to `app.js` with the help of `require.config`
* wrap the code with a `define(function(require)` and use `var Backbone = require('backbone');`to import a module
* it should work in the browser
* move every class from `app.js`to a dedicated file with its own dependencies
* a `musicians` folder can be created to gather every class relative to it
* again, it should work in the browser
* extract every templates from `index.html` to a dedicated `html` file in a `templates` folder

### step 16: minify the app in one file
**goal:** When working with a module or not, the file have to be minified to be loaded as fast as possible by the users.

* use `r.js` optimizer to minify the app in `dist/app.js`
* test it by replacing the `index.html` data-main path
* use gulp or grunt or npm to replay the minification

### step 17: load asynchronously a file
**goal:** By default, every file bundled is loaded on the min file. This can be configured to load only a part of the code and lazy load some parts only when they are needed.

* create a file `static/proverbs.js` with an object containing an attribute value equal to `"A single tree makes no forest; one string makes no music."`
* use `require` once the user is logged to concatenate the proverbs.music to below the user name
* build the app and verifies that only 2 files are loaded, the main build and this `proverbs` file

### step 18: test setup
* grab the test setup [from this diff](https://bitbucket.org/yamsellem/backbone.training/branch/step18?dest=step17#diff)
* open `public/test/index.html`in a browser to check if it pass

### step 19: test a collection filtering and validation
**goal:** Tests can be of a great help when writing complex code, and they can be kept to avoid future regression. You should guaranty that the `filter` and `validate` methods return as expected.

* write a test that creates a collection of 4 musicians, filters it by a criteria and verifies that the result of the filter is correct
* write a test that tries to add a musician to that collection that succeed (with the `add` method)
* write a test that tries to add a musician to that collection that failed (because of a validation error (name is too short, for example)) and verifies that the `invalid` event is triggered

### step 20: test a model fetch while simulating ajax response
**goal:** Unit testing needs to properly isolate a functionnality to assert it work as expected. For that, it often needs to ignore external access like ajax request.

* write a test that `fetch` the user model
* add `sinon` to bower and use it to stub ajax and return a promise with `{name: 'john'}` as content
* in the test, subscribe to the `fetch().done` to assert the received datas

### step 21: test a view rendering
**goal:** Test can also be used to verify a proper rendering. It's not common but it can help sometimes. Here, you should verify that the loggin view switches well between login and logout.

* write a test that creates a `LoginView`
* stub the `user.fetch` to failed and verifies that the generated html contains `Please, enter your credentials`
* stub the `user.fetch` to succeed and verifies that the generated html contains `Welcome`

### step 22: black-box test the main page
**goal:** Asserting an application works well can be done though an headless browser that simulates a user navigation. Here you should display the application and navigate in it with one of those tool to verifies it displays the musicians on startup.

* write a test that connects to localhost and verifies that 9 `.face` are there (use zombie, casper, nightmare or another integration test library)
* use gulp or grunt or npm to launch a server on another port each time the integration test are run (tips: use `process.env.PORT` on the server and on the integration test to switch port)

### step 23: black-box test access not authorized
* write a test that clicks on a musician but fails to delete it because the user is not authenticated
* verify that a failure message is displayed

### step 24: black-box test login
* write a test that login the user, tries to delete a musician and succeed
* verify that a success message is displayed

### step 25: watch and test
* use gulp or grunt or npm to watch the project js files and launch unit tests on change

### step 26: enter marionette
**goal:** Marionette shines on layout/view management. You should enjoy transforming your hand-made backbone layout into the dedicated `LayoutView`.

* add marionette to bower and requirejs shim
* replace the `LayoutView` with a `Marionette.LayoutView`
* fix the `Router` calls to `LayoutView` accordingly
* the `regions` attrbute can be used to identify place to show/switch view, the `onRender` attribute can be used to keep the previous `render` code (this method cannot be overridden directly), the `show` method can be used to handle operation once this view has been added to the DOM

### step 27: notifications blink
* find why `NotificationView` acts strangely and fix it

### step 28: musician creation view review
**goal:** Marionette also shines on collection/item view handling. You should enjoy turn your musicians view into the dedicated `CollectionView`.

* change `MusicianCreationView` into a `LayoutView`, the attribute `ui` can be used to gather every DOM selector, the `regions` attribute can be used
* change `MusicianFacesView` into a `CollectionView`, the attributes `childView`, `childEvents` can be used to configure this view
* change `MusicianFaceView` into an `ItemView`, the previous `render` method is no longuer needed
* make the `selected` event continue to work

### step 29: musician view review
* change `MusiciansView` into a `CollectionView`
* change `MusicianView` into an `ItemView`
* the `tooltip` should continue to work
* bonus: you may use the new filter method introduced by Marionette 2.4

### step 30: enable musician list live editing
**goal:** The musician list is read only. You should make it editable inline.

* give two 'sides' to the musician template, one readable only, one with a form
* the form should be hidden by default and revealed on a click on an edit button
* validating the form should save the model and rerender the view on success

### step 31: prevent deletion of the last musician of a band
**goal:** The musician list can be deleted unless the last one, a server denial. The three major band of the show — Floyd, Beatles, Zeppelin — should not have there last musician deleted too, a client denial.

* instead of deleting on click, emit an event that the collection view will handle
* the collection view can trigger an other event on the model if it can be deleted according to its rules
* bonus: this logic can be replaced with the [radio](https://github.com/marionettejs/backbone.radio) library

### step 32: add realtime fame to those musicians
**goal:** Those musicians are very famous - and there fame increase all the time. You should add a fame counter near there name & let the server increase it at a regular peace one musician at a time. Clicking on the fame counter should increase the fame again and again.

* use [socket.io](http://socket.io/) to create a full duplex channel between the server and its clients (website [docs tab](http://socket.io/docs/) is a good place to start)
* in a nutshell: add [socket.io-client](https://github.com/automattic/socket.io-client) to bower, add [socket.io](https://github.com/Automattic/socket.io) to the server package.json dependencies and connect one another
* server side: pick one musician every x ms, increase its fame, and emit an event on every socket
* client side: rerender a musician on fame change (do not rerender when a musician is in edit mode),
* client side: when clicking on the fame counter, emit an event with the musician id
* server side: on this event, increase the musician fame and update the client though its socket

### steps 33+: try to resolve one/several of those mysteries
* How to handle a multistep form? e.g. update the musician creation to be a 2 steps form
* How to handle an infinity scroll? e.g. paginate the musicians 5 by 5 and scroll bottom to unveil the others
* How to hide some View on some screen resolutions? e.g. hide musicians filter on smaller screens
