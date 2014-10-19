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