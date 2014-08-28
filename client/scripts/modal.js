Template.modal.info = function() {
  return Session.get('movieInfo');
};

var closeModal = function() {
  Session.set('movieInfo', []);
  $('.modal').add('.overlay').fadeOut('fast');
  $('body').css({overflow: 'auto'});
  $('input').prop('disabled', false);
};

Template.modal.events({
  'click #add-movie': function(event, template) {
    event.preventDefault();

    Movies.insert(Session.get('movieInfo'), function(err, id) {
      if (err) console.log(err);
      closeModal();
    });
  },
  
  'click .modal-close': function(event, template) {
    closeModal();
  }
});
