if (Meteor.isClient) {

  // Check for an empty string.
  String.prototype.isEmpty = function() {
    return this.length === 0 || !this.trim();
  };

  // Determine which key was pressed.
  var pressed = function(key) {
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
    }
  };

  // Search the OMDbAPI for a movie title.
  var searchApi = function(title) {
    $.ajax({
      url: 'http://www.omdbapi.com/?s=' + title,
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        if ('undefined' !== typeof data.Search) {
          Session.set('loading', false);
          Session.set('searchResults', data.Search);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        Session.set('loading', false);
        console.error(errorThrown.message);
      }
    });
  };

  // Fetch a movie's details based on its IMDbID.
  var fetchDetails = function(imdbId) {
    // TODO: if in DB, retrieve from there
    $.ajax({
      url: 'http://www.omdbapi.com/?i=' + imdbId,
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        showModal(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown.message);
      }
    });
  };

  // Show modal window and disable other parts of the UI.
  var showModal = function(data) {
    Session.set('movieInfo', data);
    $('.overlay').fadeIn('fast');
    $('.modal').slideDown('fast');
    $('body').css({overflow: 'hidden'});
    $('input').prop('disabled', true);
  };

  // Clear results and reset the search field.
  var clearSearch = function() {
    Session.set('searchResults', []);
    $("#search-form").val('');
  };

  Template.search.helpers({
    'results': function() {
      // Populate the autocomplete with results.
      return Session.get('searchResults');
    },
    'loading': function() {
      return Session.get('loading');
    }
  });

  Template.search.events({
    'keyup #search-form': function(event, template) {
      var key = event.which;
      // Update the results based on search field contents.
      if (pressed(key) === 'alphNum' || pressed(key) === 'delete') {
        var searchTerm = template.find('#search-form').value;
        if (searchTerm.isEmpty()) {
          Session.set('loading', false);
          Session.set('searchResults', []);
        } else {
          Session.set('loading', true);
          searchApi(searchTerm);
        }
      }
    },

    'keydown #search-form': function(event, template) {
      var key = event.which;

      // Bring up the results of the first movie.
      if (pressed(key) === 'enter') {
        event.preventDefault();
        if (!_.isEqual(Session.get('searchResults'), [])) {
          fetchDetails(template.find('.result a').dataset.imdbid);
          clearSearch();
        }
        return;
      }

      // Focus first movie in the list.
      if (pressed(key) === 'down' || pressed(key) === 'tab') {
        event.preventDefault();
        if (!_.isEqual(Session.get('searchResults'), [])) {
          template.find('.result a').focus();
          $(document.activeElement.parentNode).addClass('active');
        }
        return;
      }
    },

    'click, keydown #results': function(event, template) {
      var key = event.which;
      var click = event.type === 'click';
      event.preventDefault();

      // Bring up the movie info.
      if (click || pressed(key) === 'enter' || pressed(key) === 'tab') {
          var imdbId = event.target.dataset.imdbid ||
            event.target.parentNode.dataset.imdbid;
          if (!imdbId) return;
          $(document.activeElement.parentNode).removeClass('active');
          fetchDetails(imdbId);
          clearSearch();
          return;
        }

      // Focus the next movie if it exists.
      if (pressed(key) === 'down') {
        var next = document.activeElement.parentNode.nextElementSibling;
        if (next) {
          $(document.activeElement.parentNode).removeClass('active');
          $(next).addClass('active');
          next.firstChild.focus();
        }
        return;
      }

      // Focus the previous movie if it exists, or the search form.
      if (pressed(key) === 'up') {
        $(document.activeElement.parentNode).removeClass('active');
        var prev = document.activeElement.parentNode.previousElementSibling;
        if (prev) {
          $(prev).addClass('active');
          prev.firstChild.focus();
        } else {
          template.find("#search-form").focus();
        }
        return;
      }
    }
  });

  // Abandon the search if the user clicks away from the autocomplete.
  $(document).on('click', function(event, template) {
    var clicked = event.target.id;
    if (clicked !== 'results' || clicked !== 'search-form') {
      clearSearch();
    }
  });
}
