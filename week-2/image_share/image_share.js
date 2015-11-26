Images = new Mongo.Collection("images");
console.log(Images.find().count());

if (Meteor.isClient) {
  Template.images.helpers({images:Images.find({}, {sort:{rating:-1}})});


  Template.images.events({
    'click .js-image': function(event) {
      $(event.target).css("width", "50px");
    },

    'click .js-del-image':function(event) {
        var image_id = this._id; // _id refers to a unique identifier for an item in a Mongo collection. "this" refers to the data the template was displaying  
        $('#'+image_id).hide('hide', function() {
          Images.remove({"_id":image_id}); // "_id":image_id is a mongo filter  
        } // end images remove function


        );
            console.log("foo");


    }, // end click js-del

    'click .js-rate-image':function(event) {
      var rating = $(event.currentTarget).data("userrating")
      console.log(rating);
      var image_id = this.id; // this refers to the data representing the template
      console.log(image_id);
      Images.update({_id:image_id}, {$set: {rating:rating}}) // first argument is the id of the image to update. second argument is the thing you want to change


    },


  }); // end events
} // end isClient

if (Meteor.isServer) {
  console.log("i am the server ")
}
