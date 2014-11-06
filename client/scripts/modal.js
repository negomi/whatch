if (Meteor.isClient) {

  // Close the modal and overlay, and clear the session data.
  var closeModal = function() {
    Session.set('movieInfo', []);
    $('.modal').add('.overlay').fadeOut('fast');
    $('body').css({overflow: 'auto'});
    $('input').prop('disabled', false);
  };

  Template.modal.helpers({
    // Fetch the current movie info stored in the session.
    info: function () {
      return Session.get('movieInfo');
    },
  });

  Template.modal.events({
    // Save the current movie to the database.
    'click #add-movie': function(event, template) {
      event.preventDefault();

      var movie = _.extend(Session.get('movieInfo'), {
        owner: Meteor.userId(),
        added: Date.now()
      });

      Movies.insert(movie, function(err, id) {
        if (err) console.log(err);
        closeModal();
      });
    },

    'click .modal-close': function(event, template) {
      closeModal();
    }
  });
}
