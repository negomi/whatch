if (Meteor.isClient) {

  // Fetch all saved movies, ordered by most recently added first.
  Template.movies.movies = function() {
    return Movies.find({owner: Meteor.userId()}, {sort: {added: -1}});
  };

  Template.movies.events({
    // Show the movie info on hover.
    'mouseenter .grid-item': function(event, template) {
      $(event.target.children[1]).slideDown('fast');
    },
    'mouseleave .grid-item': function(event, template) {
      $(event.target.children[1]).slideUp('fast');
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
