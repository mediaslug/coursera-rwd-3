Images = new Mongo.Collection("images");
console.log(Images.find().count());

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  })

  Template.images.helpers({
    images:Images.find({}, {sort:{createdOn: -1, rating:-1}}),
    getUser:function(user_id) { // the helper takes user_id as a parameter
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
  Template.body.helpers({
    username: function() {
      if (Meteor.user()) {
        return Meteor.user().emails[0].address;
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
      var image_id = this.id; // this refers to the data representing the template
      console.log(image_id);
      Images.update({_id:image_id}, {$set: {rating:rating}}) // first argument is the id of the image to update. second argument is the thing you want to change


    },

    'click .js-show-image-form':function(event) {
      $("#image_add_form").modal('show');
    }, 

    'click js-set-image-filter': function(event) {
      // this is the data context for the template in which the event occured.
      Session.set("userFilter",this.createdBy)

    } // end js-set-image-filter click


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
          createdBy: Meteor.user()._id
        });
        
      }
      $("#image_add_form").modal('hide');

      return false; // to over-ride default browser submit behavior

    } // end submit click event

  });

} // end isClient

if (Meteor.isServer) {
  console.log("i am the server ")
}
























