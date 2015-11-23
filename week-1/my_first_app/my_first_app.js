if (Meteor.isClient) {
  var time = new Date();
  console.log(time);
  var data = {
      time: time
    };

  Template.time.helpers(data);
}

if (Meteor.isServer) {
  
}
