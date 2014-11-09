if (Meteor.isClient) {
  Template.movies.helpers({
    // Return a list of the user's saved movies, taking into account
    // any filters applied. Default sorting is by most recently added first.
    'movies': function() {
      var sortOrder = Session.get('sortOrder') || {added: -1};

      var collection = Movies.find({
        owner: Meteor.userId(),
        Genre: {$regex: new RegExp(Session.get('genreFilter')) },
        Country: {$regex: new RegExp(Session.get('countryFilter')) },
        Director: {$regex: new RegExp(Session.get('directorFilter')) },
        Language: {$regex: new RegExp(Session.get('languageFilter')) },
      },
      {
        sort: sortOrder
      });

      return collection;
    }
  });

  Template.movies.events({
    // Show the movie info on hover.
    'mouseenter .grid-item': function(event, template) {
      $(event.target.children[1]).fadeIn('fast');
    },
    'mouseleave .grid-item': function(event, template) {
      $(event.target.children[1]).hide();
    },
    // Delete a movie.
    'click .delete': function(event, template) {
      event.preventDefault();
      Movies.remove(this._id, function(err, id) {
        if (err) console.log(err);
      });
    }
  });
}
