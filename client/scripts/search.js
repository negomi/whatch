if (Meteor.isClient) {

  // Determine which key was pressed
  var pressed = function(key) {
    if (key >= 48 && key <= 90) {
      return 'alphNum';
    } else if (key === 38) {
      return 'up';
    } else if (key === 40) {
      return 'down';
    } else if (key === 13) {
      return 'enter';
    } else if (key === 8) {
      return 'delete';
    }
  };

  // Search OMDbAPI for movie title
  var searchApi = function(title) {
    $.ajax({
      url: 'http://www.omdbapi.com/?s=' + title,
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        if ('undefined' !== typeof data.Search) {
          Session.set('searchResults', data.Search);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown.message);
      }
    });
  };

  // Fetch movie details based on IMDbID
  var fetchDetails = function(imdbId) {
    // TODO if in DB, retrieve from there
    $.ajax({
      url: 'http://www.omdbapi.com/?i=' + imdbId,
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        // show modal overlay with movie data
        Session.set('movieInfo', data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown.message);
      }
    });
  };

  // Populate autocomplete with results 
  Template.search.results = function() {
    return Session.get('searchResults');
  };

  Template.search.events({
    'keyup #search-form': function(event, template) {
      var key = event.which;

      // Update results based on search field
      if (pressed(key) === 'alphNum' || pressed(key) === 'delete') {
        var searchTerm = template.find('#search-form').value;
        if (searchTerm.isEmpty()) {
          Session.set('searchResults', []);
        } else {
          searchApi(searchTerm);
        }
      } else {
        event.preventDefault();

        // Bring up results of first movie
        if (pressed(key) === 'enter') {
          if (!_.isEqual(Session.get('searchResults'), [])) {
            fetchDetails(template.lastNode.firstElementChild.dataset.imdbid);
            Session.set('searchResults', []);
          }
        }

        // Focus first movie in list
        if (pressed(key) === 'down') {
          if (!_.isEqual(Session.get('searchResults'), []))
            template.lastNode.firstElementChild.focus();
        }
      }
    },
    'click, keydown #results': function(event, template) {
      var key = event.which;
      event.preventDefault();

      // Bring up movie info
      if (event.type === 'click' || pressed(key) === 'enter') {
        var imdbId = event.target.dataset.imdbid ||
          event.target.parentNode.dataset.imdbid;
        fetchDetails(imdbId);
        Session.set('searchResults', []);
        $('#search-form').val('');
      }

      // Focus next movie if it exists
      if (pressed(key) === 'down') {
        if (document.activeElement.nextElementSibling) {
          document.activeElement.nextElementSibling.focus();
        }
      }

      // Focus previous movie or search form
      if (pressed(key) === 'up') {
        if (document.activeElement.previousElementSibling) {
          document.activeElement.previousElementSibling.focus();
        } else {
          $('#search-form').focus();
        }
      }
    }
  });
}
