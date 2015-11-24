Images = new Mongo.Collection("images");
console.log(Images.find().count());

if (Meteor.isClient) {
  Template.images.helpers({images:Images.find()});


  Template.images.events({
    'click .js-image': function(event) {
      $(event.target).css("width", "50px");
    },

    'click .js-del-image':function(event) {
        var image_id = this._id; // _id refers to a unique identifier for an item in a Mongo collection. "this" refers to the data the template was displaying  
        $('#'+image_id).hide('slow', function() {
          Images.remove({"_id":image_id}); // "_id":image_id is a mongo filter  

        });
    }

  });
}

if (Meteor.isServer) {
  console.log("i am the server ")
}

console.log("where am I running");
