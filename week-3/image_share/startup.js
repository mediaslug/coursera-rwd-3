if (Meteor.isServer) {
	Meteor.startup(function() {
		if (Images.find().count() == 0 ) {
			for (var i=1; i<23; i++) {
				console.log("img_" + i + ".jpg");
				Images.insert(
				{
     				img_src: "img_" + i + ".jpg",
      				img_alt: "image number " + i
   				}	

				); 
			} // end of for loop to insert images

			// count of images inserted:
			console.log(Images.find().count());

			

		} // end if imaage
	}); // end startup

	

} // end if isServer