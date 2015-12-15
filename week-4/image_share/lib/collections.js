Images = new Mongo.Collection("images");

//set up security on Images collection
Images.allow({
	insert:function(userId, doc) {
		console.log("testing security on image insert");
		
		// doc is the image data that we're going to insert
		// the server has full access to the data the user is attempting to insert
		// so we can inspect it before we do anything with it

		//console.log(doc);

		if (Meteor.user()) {
			if (doc.createdBy != userId) { // userId is the id of the person who has attempted the action
			console.log("denied wrong userId");

				return false;	
			} else { // the user is logged in and userId matches createdBy
				console.log("allowed")
				return true;

			}
			
		} else { // user is not logged in
			console.log("denied not logged in")

			return false;
		}
		
	},

	remove: function() {
		console.log("testing security on image remove")
		//console.log(_id);
		return true;
	}

}); 