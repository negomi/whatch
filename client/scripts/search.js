if (Meteor.isClient) {

  // Check for empty string
  String.prototype.isEmpty = function() {
    return this.length === 0 || !this.trim();
  };

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
    } else if (key === 9) {
      return 'tab';
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

  // Clear results and reset search field
  var clearSearch = function() {
    Session.set('searchResults', []);
    $("#search-form").val('');
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
      }
    },
    'keydown #search-form': function(event, template) {
      var key = event.which;

      // Bring up results of first movie
      if (pressed(key) === 'enter') {
        event.preventDefault();
        if (!_.isEqual(Session.get('searchResults'), [])) {
          fetchDetails(template.find('.result a').dataset.imdbid);
          clearSearch();
        }
      }

      // Focus first movie in list
      if (pressed(key) === 'down' || pressed(key) === 'tab') {
        event.preventDefault();
        if (!_.isEqual(Session.get('searchResults'), [])) {
          template.find('.result a').focus();
          $(document.activeElement.parentNode).addClass('active');
        }
      }
    },
    'click, keydown #results': function(event, template) {
      var key = event.which;
      var click = event.type === 'click';
      event.preventDefault();

      // Bring up movie info
      if (click || pressed(key) === 'enter' || pressed(key) === 'tab') {
          $(document.activeElement.parentNode).removeClass('active');
          var imdbId = event.target.dataset.imdbid ||
            event.target.parentNode.dataset.imdbid;
          fetchDetails(imdbId);
          clearSearch();
        }

      // Focus next movie if it exists
      if (pressed(key) === 'down') {
        var next = document.activeElement.parentNode.nextElementSibling;
        if (next) {
          $(document.activeElement.parentNode).removeClass('active');
          $(next).addClass('active');
          next.firstChild.focus();
        }
      }

      // Focus previous movie or search form
      if (pressed(key) === 'up') {
        $(document.activeElement.parentNode).removeClass('active');
        var prev = document.activeElement.parentNode.previousElementSibling;
        if (prev) {
          $(prev).addClass('active');
          prev.firstChild.focus();
        } else {
          template.find("#search-form").focus();
        }
      }
    }
  });

  // Abandon search if user clicks away from the autocomplete
  $(document).on('click', function(event, template) {
    var clicked = event.target.id;
    if (clicked !== 'results' || clicked !== 'search-form') {
      clearSearch();
    }
  });
}
