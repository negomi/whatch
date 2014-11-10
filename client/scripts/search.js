if (Meteor.isClient) {

  Template.search.helpers({
    results: function() {
      return Session.get('searchResults');
    },
    loading: function() {
      return Session.get('loading');
    }
  });

  Template.search.events({
    'keyup #search-form': function(event, template) {
      var key = event.which;
      var searchKeys = ['alphNum', 'delete'];

      if (autocomplete.isAllowed(key, searchKeys)) {
        autocomplete.updateResults();
      }
    },

    // event.preventDefault() needs to be inside the if statements here,
    // otherwise it prevents any text being entered into the search form.
    'keydown #search-form': function(event, template) {
      var key = event.which;

      if (autocomplete.pressed(key) === 'enter') {
        event.preventDefault();
        autocomplete.fetchFirst();
      }

      var focusKeys = ['down', 'tab'];
      if (autocomplete.isAllowed(key, focusKeys)) {
        event.preventDefault();
        autocomplete.focusFirst();
      }
    },

    'click, keydown #results': function(event, template) {
      event.preventDefault();
      var key = event.which;

      var enterKeys = ['enter', 'tab'];
      if (event.type === 'click' || autocomplete.isAllowed(key, enterKeys)) {
        autocomplete.fetch();
      }

      if (autocomplete.pressed(key) === 'down') {
        autocomplete.focusNext();
      }

      if (autocomplete.pressed(key) === 'up') {
        autocomplete.focusPrevious();
      }
    }
  });
}
