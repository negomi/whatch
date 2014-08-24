if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Movies = new Meteor.Collection('movies');

    // Movies.publish('movies', function() {
    //   return Movies.find({});
    // });

    Movies.allow({
      insert: function() {
        return true;
      },
      remove: function() {
        return true;
      }
    });
  });
}
