// add routing
Router.configure({
	layoutTemplate:"ApplicationLayout"
});

Router.route('/', function () {
 	this.render('navbar', { to:"navbar"});
	this.render('add_and_list', {to:"main"});
});

Router.route('/search', function() {
	this.render('navbar', {to:"navbar"});
	this.render('search', {to:"main"});

})	

Router.route('/detail/:_id', function () {
	this.render('navbar', {to:"navbar"});
  
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


// ************* add search functionality
//  create a source in the client
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['packageName', 'description'];

PackageSearch = new SearchSource('websites', fields, options);

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
    getUser:function(){
		return Meteor.user();
	}

});

Template.website_detail.helpers({
	comments:function() {
		return Comments.find({websiteId:Session.get("selectedWebsite")}, {sort:{createdOn:-1}})
	}
});

// ********************************* search
// get a reactive data source for this source, which can be used to render templates

Template.searchResult.helpers({
  getPackages: function() {
    return PackageSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {isoScore: -1}
    });
  },
  
  isLoading: function() {
    return PackageSearch.getStatus().loading;
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
		// console.log("Up voting website with id "+websiteId);


		// put the code in here to add a vote to a website!
		Websites.update(websiteId, {$inc:{vote: 1}})

		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var websiteId = this._id;
		// console.log("Down voting website with id "+websiteId);


		// put the code in here to remove a vote from a website!
		// subtract 1 from the voteCount
		Websites.update(websiteId, {$inc:{vote: -1}})

		return false;// prevent the button from reloading the page
	},

	'click .js-set-Id':function() {
		var websiteId = this._id;
		 Session.set('selectedWebsite', websiteId);
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
		// console.log("The url they entered is: "+url +" " +description);

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
		// console.log(comment + " " + this._id);
		Comments.insert({
			comment:comment,
			websiteId:this._id,
      		createdOn: new Date(),
      		createdBy: Meteor.user()._id, // _id provides access to unique database id for the user
         });
		return false;
	}
	,

	'click .remove':function() {
      var selectedWebsite = Session.get('selectedWebsite');
      var confirm = window.confirm("want to delete?");
      if (confirm) {
        Websites.remove(selectedWebsite);  
      }
      
    }
});

// ***************************** search
Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PackageSearch.search(text);
  }, 200)
});
