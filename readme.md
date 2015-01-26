## Backbone Training

**Hi there.** Welcome to the Backbone Training sessions. Here's a couple of steps that will bring you front-end superpowers. For each step, you'll find a git branch named alike including a solution.

#### before starting, check everything is up and running
* install [nodejs](http://nodejs.org/)
* install [bower](http://bower.io/)
* install bower dependencies `bower install`
* run the server `node server.js`
* access to `index.html` through `http://server:3000`

### step 1: display static musician list with backbone
* add js imports (`jquery`, `underscore`, `backbone`, `handlebars`)
* extract template from html
* display it with a view (static content)

### step 2: fetch musician list from the server and display it
* keep only one block and replace static content with {{ name/bio/picture }} 
* use a static object to test it
* create a collection pointing to /musicians
* handle muliple results in template
* add a modulo on collection iteration

### step 3: add class 'delete' on one musician mouseover
* show & hide class 'delete' on one musician mouseover
* delete model on click (tips: create one view per model)
* refresh page display

### step 4: display a notification on removal (potentially multiple)
* create a view with a notification template
* listen to the previous collection removal
* add an alert and remove it after a while
* handle multiple alerts (only display one on multiple removal)
* handle a click on the alert crose (×)

### step 5: handle error on last musician deletion
* the server will refuse to delete the last item of the list
* prevent the last element from being deleted when an error occured
* display a red notification

### step 6: navigate to a new page on click on 'add an artist'
* change route on click on 'add on artist' & 'login' and title
* extract every html node between nav and footer in a template
* create a 'layout' view to render this template
* wrap existing view creation in this layout view render

### step 7: create a new musician
* create a new view and display the creation form template in it
* capture input values on form submition
* create a new model and save it on the server
* display a success notification
* clear inputs after success

### step 8: add a face to this new musician
* create a view that will fetch /picture urls and render them
* retain the last selected url (unselect others on click)
* save it with the previous name & bio infos

### step 9: create a login screen
* activate the nodejs authentication route
* create a login view with two templates, login and logged
* create a user model with fetch url /user & save + delete url /user/signin
* fetch the user on each display of the view and display accordingly
* handle login & logout
* check that musician creation & deletion only work once logged

### step 10: handle every errors
* override backbone sync to handle every errors
* trigger a notification on every errors except on user model errors
* trigger a success notification on every view that use to
* add animate.css to bower and shake login submit button on error

### step 11: hunt phantom views
* log every error notification in the console and navigate back and forth between 'pages': something wrong is happening when logout + show home multiple times, right?
* views stay subscribed on route change, active objects prevent them to be garbage collected
* the same happens to view dom events subscription when an el is given on creation, otherwise Backbone create a div (configurable) for the view and attach events to it
* hunt phantom views!

### step 12: validate model
* validate that musician creation do not use a name of 3 characters or less
* listen to the invalid event and add an 'invalid' class around the name input

### step 13: filter collection
* add a [subnav](http://foundation.zurb.com/docs/components/subnav.html) with filters [All, Floyd, Beatles, Zeppelin]
* filter the collection when clicking on a criteria
* highlight visually the filter links when selected
* update the browser history on each filter selection, display only the appropriate musician when refreshing the page

### step 14: add a tooltip
* add the formstone [tipper](http://formstone.it/components/tipper) dependency to bower
* import its css and js to `index.html`
* add a `Filter musicians by band` tooltip on the `Filter:` title

### step 15: split the app with requirejs
* add requirejs to bower
* move script imports from `index.html` to `app.js` with the help of `require.config`
* wrap the code with a `define(function(require)` and use `var Backbone = require('backbone');`to import a module
* it should work in the browser
* move every class from `app.js`to a dedicated file with its own dependencies
* a `musicians` folder can be created to gather every class relative to it
* again, it should work in the browser
* extract every templates from `index.html` to a dedicated `html` file in a `templates` folder

### step 16: minify the app in one file
* use r.js optimizer to minify the app in `dist/app.js`
* test it by replacing the `index.html` data-main path
* use gulp or grunt or npm to replay the minification

### step 17: load asynchronously a file
* create a file `static/proverbs.js` with an object containing an attribute value equal to `"A single tree makes no forest; one string makes no music."`
* use `require` once the user is logged to concatenate the proverbs.music to below the user name
* build the app and verifies that only 2 files are loaded, the main build and this `proverbs` file

### step 18: test setup
* grab the test setup [from this diff](https://bitbucket.org/yamsellem/backbone.training/branch/step18?dest=step17#diff)
* open `public/test/index.html`in a browser to check if it pass

### step 19: test a collection filtering and validation
* write a test that creates a collection of 4 musicians, filters it by a criteria and verifies that the result of the filter is correct
* write a test that tries to add a musician to that collection that succeed (with the `add`method)
* write a test that tries to add a musician to that collection that failed (because of a validation error (name is too short, for example)) and verifies that the `invalid` event is triggered

### step 20: test a model fetch while simulating ajax response
* write a test that `fetch` the user model
* add `sinon`to bower and use it to stub ajax and return a promise with `{name: 'john'}` as content
* in the test, subscribe to the `fetch().done` to assert the received datas

### step 21: test a view rendering
* write a test that creates a `LoginView`
* stub the `user.fetch` to failed and verifies that the generated html contains `Please, enter your credentials`
* stub the `user.fetch` to succeed and verifies that the generated html contains `Welcome`

### step 22: black-box test home
* write a test that connects to localhost and verifies that 9 `.face` are there (use zombie, casper, nightmare or another integration test library)
* use gulp or grunt or npm to launch a server on another port each time the integration test are run (tips: use `process.env.PORT` on the server and on the integration test to switch port)

### step 23: black-box test not authorized
* write a test that clicks on a musician but fails to delete it because the user is not authenticated
* verify that a failure message is displayed 

### step 24: black-box test login
* write a test that login the user, tries to delete a musician and succeed
* verify that a success message is displayed

### step 25: watch and test
* use gulp or grunt or npm to watch the project js files and launch unit tests on change

### step 26: enter marionette
* add marionette to bower and requirejs shim
* replace the `LayoutView` with a `Marionette.LayoutView``
* fix the `Router` calls to `LayoutView` accordingly

### step 27: notifications blink
* find why `NotificationView` acts strangely and fix it

### step 28: musician creation view review
* change `MusicianCreationView` into a `LayoutView`
* change `MusicianFacesView` into a `CollectionView`
* change `MusicianFaceView` into an `ItemView`
* the `selected` event should continue to work

### step 29: musician view review
* change `MusiciansView` into a `CollectionView`
* change `MusicianView` into an `ItemView`
* the `tooltip` should continue to work

### steps 30+: try to resolve one/several of those mysteries
* How to turn static content into editable content (back and forth)? e.g. make a musician item editable (`name` & `bio` with inputs
* How to add an item to a collection without knowing the collection validation rules? e.g. create a top 3 at the right of the musician collection, clicking on a musician adds it to the top 3, clicking again removes it; only 3 musicians of a different band can be added at the same time (the top 3 view should handle this validation logic)
* How to display a view on every page that changes only for some URL? e.g. handle a different big header only on the login screen (the buttons are hidden for example)
* How to handle a multistep form? e.g. update the musician creation to be a 2 steps form
* How to handle a infinity scroll? e.g. paginate the musicians 5 by 5 and scroll bottom to unveil the others
* How to hide some View on some screen resolutions? e.g. hide musicians filter on smaller screens
* How to synchronise a user in realtime? e.g. add a `reputation` attribute to the user resource, and, server side, make it change on a random basis, the client-side should be updated in realtime without fetching the server