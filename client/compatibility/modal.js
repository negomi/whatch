// Handles showing/hiding the modal window and overlay.
var modal = {

  // Show modal window and disable other parts of the UI.
  show: function(data) {
    Session.set('movieInfo', data);
    $('.overlay').fadeIn('fast');
    $('.modal').slideDown('fast');
    $('body').css({overflow: 'hidden'});
    $('input').prop('disabled', true);
  },

  // Close the modal and overlay, and clear the session data.
  close: function() {
    Session.set('movieInfo', []);
    $('.modal').add('.overlay').fadeOut('fast');
    $('body').css({overflow: 'auto'});
    $('input').prop('disabled', false);
  }
};
