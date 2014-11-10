// Handles the autocomplete functionality required for the search.
var autocomplete = {

  // Determine which key was pressed.
  pressed: function(key) {
    if (key >= 48 && key <= 90) {
      return 'alphNum';
    } else if (key === 38) {
      return 'up';
    } else if (key === 40) {
      return 'down';
    } else if (key === 13) {
      return 'enter';
    } else if (key === 9) {
      return 'tab';
    } else if (key === 8) {
      return 'delete';
    } else {
      return false;
    }
  },

  // Check if a given key is present in a list of specified allowed keys.
  isAllowed: function(keyPressed, keyList) {
    return _.some(keyList, function(key) {
      return key === autocomplete.pressed(keyPressed);
    });
  },

  // Update the results based on search field contents.
  updateResults: function() {
    var searchTerm = $('#search-form').val();
    if (searchTerm.isEmpty()) {
      Session.set('loading', false);
      Session.set('searchResults', []);
    } else {
      Session.set('loading', true);
      api.search(searchTerm);
    }
  },

  // Focus first item in the list.
  focusFirst: function() {
    if (!_.isEqual(Session.get('searchResults'), [])) {
      $('.result a').first().focus();
      $(document.activeElement.parentNode).addClass('active');
    }
  },

  // Focus the next movie if it exists.
  focusNext: function() {
    var next = document.activeElement.parentNode.nextElementSibling;
    if (next) {
      $(document.activeElement.parentNode).removeClass('active');
      $(next).addClass('active');
      next.firstChild.focus();
    }
  },

  // Focus the previous item if it exists, or the search form.
  focusPrevious: function() {
    $(document.activeElement.parentNode).removeClass('active');
    var prev = document.activeElement.parentNode.previousElementSibling;
    if (prev) {
      $(prev).addClass('active');
      prev.firstChild.focus();
    } else {
      template.find("#search-form").focus();
    }
  },

  // Bring up the results of the first item.
  fetchFirst: function() {
    if (!_.isEqual(Session.get('searchResults'), [])) {
      api.fetch($('.result a').first().data().imdbid);
      autocomplete.clear();
    }
  },

  // Bring up the selected item's info.
  fetch: function() {
    var imdbId;
    try {
      imdbId = $(event.target).data().imdbid ||
      $(event.target.parentNode).data().imdbid ||
      $(event.target.firstChild).data().imdbid;
    }
    finally {
      if (!imdbId) return;
      $(document.activeElement.parentNode).removeClass('active');
      api.fetch(imdbId);
      autocomplete.clear();
    }
  },

  // Clear results from the session and reset the search field.
  clear: function() {
    Session.set('searchResults', []);
    $("#search-form").val('');
  }
};

// Abandon the search if the user clicks away from the autocomplete.
$(document).on('click', function(event, template) {
  var clicked = event.target.id;
  if (clicked !== 'results' || clicked !== 'search-form') {
    autocomplete.clear();
  }
});
