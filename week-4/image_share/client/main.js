console.log("on the client from separate file");
/// iron router

// configure the router
// apllicationlayout is a "super" template into which we can insert other templates
// you can have one global layout and swap out the components within that layout
Router.configure({
	layoutTemplate:"ApplicationLayout"
});
Router.route('/', function() {
	this.render("welcome", {
		to:"main"
	});
	
});

Router.route('/images', function () {
  this.render('navbar', {
	  to:"navbar"
  });
  this.render('images', {
  	to:"main"
  });
});

Router.route('/image/:_id', function () {
  this.render('navbar', {
	  to:"navbar"
  });
  this.render('image', {
  	to:"main",
	data: function() {
		return Images.findOne({_id:this.params._id});
	}
  });
});


/// infini scroll
Session.set("imageLimit", 8);
lastScrollTop = 0; 
  $(window).scroll(function(event){
    // test if we are near the bottom of the window
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      // where are we in the page? 
      var scrollTop = $(this).scrollTop();
      // test if we are going down
      if (scrollTop > lastScrollTop){
        // yes we are heading down...
      console.log('near the bottom and going down');

       Session.set("imageLimit", Session.get("imageLimit") + 4);
      }

      lastScrollTop = scrollTop;
    }
        
  });
  // reconfigure the accoint system to allow for username and email, rather than just email
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  })

  Template.images.helpers({
    images:function(){ // helper to find images
      if (Session.get("userFilter")) { // if there is a user filter, find images based on the filter
        // createdBy must be equal to session.get("userFilter"), which is a mongo filter
        return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1, rating:-1}}) 

      } else { // find all images
        return Images.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")})

      } // end if check for user filter in Session
    }, // end function

    filtering_images:function(event){ // determine if we are filtering users
      if (Session.get('userFilter')) {
        return true;
      } else {
        return false; 
      } // end if
    }, // end function

    getFilterUser:function(event) { // get the username of the user we're filtering on
      if (Session.get('userFilter')) {
        var user = Meteor.users.findOne({_id:Session.get('userFilter')}); // the session variable is used as a filter
        return user.username;
      } else {
        return false;
      }


    }, // end function
    getUser:function(user_id) { 
      // findOne is another way of pulling something out of a MongoDb
      // Meteor.users provides access to a collection that we can call find on.

      // the helper takes user_id as a parameter.  the filter is _id. so the user's id needs 
      // to be equal to the id that is getting passed in in the html template. 
      var user = Meteor.users.findOne({_id:user_id});   
      if (user) {
        return user.username;

      } else {
        return "anon";
      }// end if

    } // end getUser function


  });

  // Template helper function to provide the template access to the user data
  // This the body template, because this is going to happen in the main body of the document 
  // helpers function allows me to bind helper functions to the template.

  // btw, this template helper is being run twice because Meteor.user is reactive 
  // (if the data changes, then the template gets re-rendered)
  Template.body.helpers({
    username: function() {

      // if the user is logged in, get the email address
      if (Meteor.user()) { // Meteor.user object with several properties. returns truthy or falsey
        return Meteor.user().username;

        //return Meteor.user().emails[0].address;
      } else {
        return "anon";
      }
    }
  });


  Template.images.events({
    'click .js-image': function(event) {
      $(event.target).css("width", "50px");
    },

    'click .js-del-image':function(event) {
        var image_id = this._id; // _id refers to a unique identifier for an item in a Mongo collection. "this" refers to the data the template was displaying  
        $('#'+image_id).hide('hide', function() {
          // in addition to hiding the div, now remove the image from the collection
          Images.remove({"_id":image_id}); // "_id":image_id is a mongo filter  
        } // end images remove function
        );


    }, // end click js-del

    'click .js-rate-image':function(event) {
      var rating = $(event.currentTarget).data("userrating")
      console.log(rating);
      var image_id = this.id; // "this" refers to the data representing the template
      console.log(image_id);
      Images.update({_id:image_id}, {$set: {rating:rating}}) // first argument is the id of the image to update. second argument is the thing you want to change

    }, // end click js-rate-image

    'click .js-show-image-form':function(event) {      
      $("#image_add_form").modal('show');

    }, // end click js-show-image-form


    'click .js-set-image-filter': function(event) {
      // "this" is the data context for the template in which the event occured. 
      // "this" gives us access to the object the template is displaying, which in this case is a single image
      
      // session allows us to store temporary variables so that we can keep track of state of things in our app
      // session stores key-value pairs and is reactive.
      
      Session.set("userFilter",this.createdBy); 
      console.log("setting Session property/variable userFilter to " + this.createdBy);

    }, // end js-set-image-filter click

    'click .js-unset-image-filter': function(event) {
      console.log("remove the filter");
      Session.set("userFilter",undefined)


    }


  }); // end images events

  Template.image_add_form.events({
    'submit .js-add-image':function(event) {
      var img_src, img_alt;
      img_src = event.target.img_src.value;
      img_alt = event.target.img_alt.value;
      console.log("src =" + img_src + " alt=" + img_alt)
      if (Meteor.user()) {
        Images.insert({
          img_src:img_src,
          img_alt:img_alt,
          createdOn: new Date(),
          createdBy: Meteor.user()._id // _id provides access to unique database id for the user
        });
        
      }
      $("#image_add_form").modal('hide');

      return false; // to over-ride default browser submit behavior

    } // end submit click event

  });
