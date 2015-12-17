// Create the collections

Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

//set up security on Websites collection
Websites.allow({
	insert:function(userId, doc) {
		console.log("testing security on website insert");
		
		// doc is the data that we're going to insert
		// the server has full access to the data the user is attempting to insert
		// so we can inspect it before we do anything with it

		// console.log(doc);

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

	update: function() {
		// we allow anonymous up-voting
		return true;
	},

	remove: function(userId, doc) {
		// we do not allow sites to be deleted
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
	}

}); 

//set up security on Comments collection

Comments.allow ({
	insert:function() {
		// anonymous comments are allowed
		return true;
	},

	update:function() {
		return false;
	},

	remove:function() {
		return false;
	}

});