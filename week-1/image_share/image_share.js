if (Meteor.isClient) {
  console.log("i am the client")

  var img_data = [
    {
      img_src: "laptops.png",
      img_alt: "a random screenshot"
    },

    {
      img_src: "dogs.png",
      img_alt: "photos of dogs"
    }
    ];

  Template.images.helpers({images:img_data});

  Template.images.events({
    'click .js-image': function(event) {
      $(event.target).css("width", "50px");
    }
  });
}

if (Meteor.isServer) {
  console.log("i am the server ")
}

console.log("where am I running");
