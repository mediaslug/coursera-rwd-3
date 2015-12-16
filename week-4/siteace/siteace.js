Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");


if (Meteor.isClient) {

	Router.configure({
		layoutTemplate:"ApplicationLayout"
	});

	Router.route('/', function () {
 	 	this.render('navbar', {
  			to:"navbar",
  		});

  		this.render('add_and_list', function(){
  			to:"main"
  		})
	});

	Router.route('/add', function() {
		this.render('navbar', {to:"navbar"});
		this.render('website_form', {to:"main"});

	})	

	Router.route('/detail/:_id', function () {
	  this.render('navbar', {
		  to:"navbar"
	  });
	  this.render('website_detail', {
	  	to:"main",
		data: function() {
			return Websites.findOne({_id:this.params._id});
		}
	  });
	});

	// configure the accounts ui interface
	Accounts.ui.config({
  		passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
	});

	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},  {sort: {vote: -1, title:1}});
		},
		count:function() {
          var currentUser = Meteor.userId();
          return Websites.find({createdBy:currentUser}).count();
        },

	});

	Template.website_detail.helpers({
		comments:function() {
			return Comments.find({}, {sort:{vote:1}})
		}
	});

	Template.website_list.helpers({
		getUser:function(){
			return Meteor.user();
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var websiteId = this._id;
			console.log("Up voting website with id "+websiteId);


			// put the code in here to add a vote to a website!
			Websites.update(websiteId, {$inc:{vote: 1}})

			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var websiteId = this._id;
			console.log("Down voting website with id "+websiteId);
			Websites.update(websiteId, {$inc:{vote: -1}})


			// put the code in here to remove a vote from a website!
			// get the current vote for the website id
			Websites.find({ _id: "-------" }); // change  to website id
			// subtract 1 from the voteCount
			// store the vote back in the database

			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			var description = event.target.description.value;
			var title = event.target.title.value;

			if (url=="" || description=="") {
				alert("URL is required.");
				return false;
			}
			console.log("The url they entered is: "+url +description);

			//  put your website saving code in here!

	      	if (Meteor.user()) { // is user logged in
				Websites.insert({
					url:url,
					title:title,
					description:description,
	          		createdOn: new Date(),
	          		createdBy: Meteor.user()._id, // _id provides access to unique database id for the user
	          		vote: 0
	          	})	
			} // end if user logged in
			return false;// stop the form submit from reloading the page

		}
	});

	Template.website_detail.events({
		'submit .js-save-comment': function(event) {
			var comment = event.target.comment.value;
			console.log(comment);
			Comments.insert({
				comment:comment,
	      		createdOn: new Date(),
	      		createdBy: Meteor.user()._id, // _id provides access to unique database id for the user
	         });
			return false;
		}
	});
}

if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
    		createdOn:new Date(),
    		vote:0
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		createdOn:new Date(),
    		vote:0
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		createdOn:new Date(),
    		vote:0
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:new Date(),
    		vote:0
    	});
    }
  });
}
