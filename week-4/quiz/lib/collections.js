Images = new Mongo.Collection("images");

//set up security on Images collection
Images.allow({ 
  insert:function(userId, doc){ 
    if (Meteor.isServer){ 
      console.log("insert on server"); 
    } 
    if (Meteor.isClient){ 
      console.log("insert on client"); 
    } 
    if (Meteor.user()){ 
      return true; 
    } else { 
      return false; 
    } 
  } 

}); 