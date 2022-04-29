$(document).ready(function () {
  var search_input = $('#search-breed');
  var search_btn = $('#search-btn');
  var suggestion_box = $('.autocomplete-box');
  var list_items = [];
  var breed_names = [];

  //on search button click first clears local storage thne page is redirected to cat breed details page and cat breed info is displayed.
  search_btn.click(function (e) { 
    e.preventDefault();
    validateCatField();
    getCatInfo();
  });

  //getBreedNames for autocomplete suggestion box
  function getBreedNames(response) {
    $.each(response, function (index, breed) { 
      breed_names.push(breed.name)
    });
  }
  getBreedNames();

  //display suggestion box on keyup 
  search_input.keyup(function (e) { 
    var input_data = e.target.value;
    var empty_array = [];
    if(input_data) {
      empty_array = breed_names.filter(function (data) {
        return data.toLocaleLowerCase().startsWith(input_data.toLocaleLowerCase());
      });
      empty_array = empty_array.map(function (data) {
        return data = '<li class="autocomplete-box-item">'+ data + '</li>'
      })
      $('.cat-search-form').addClass('active');
      showSuggestions(empty_array);
      $('.autocomplete-box li').each(function() {
        $(this).click(function() {
          search_input.val($(this).text());
          $('.cat-search-form').removeClass('active');
        })
      })
    } else {
      $('.cat-search-form').removeClass('active');
    }
  });

  function showSuggestions(list) {
    var listData;
    if(!list.length) {
     var user_input = search_input.val();
     listData = '<li class="autocomplete-box-item">' + user_input + '</li>';
    } else {
      listData = list.join('')
    }
    suggestion_box.html('');
    suggestion_box.append(listData)
  }

  //function to get cat breed details data from cat api and stores it in local storage and then calls getImages 
  function getCatInfo() {
    $.ajax({
      type: 'GET',
      url: 'https://api.thecatapi.com/v1/breeds/search?q='+search_input.val(),
      headers: {'x-api-key' : 'c01bb41e-223c-4c42-8d3f-32776d4d64a9'},
      data: 'JSON',
      success: function(response) {
        localStorage.setItem('breed_details', JSON.stringify(response));
        var search_input_value = search_input.val().substring(0,4);
        getImages(search_input_value);
      }
    });
  }

  //function to get cat breed images data and stores it in local storage
  function getImages(search_input_value) {
    $.ajax({  
      type: 'GET',
      url: `https://api.thecatapi.com/v1/images/search?breed_id=${search_input_value}&limit=9`,
      headers: {'x-api-key' : 'c01bb41e-223c-4c42-8d3f-32776d4d64a9'},
      data: 'JSON',
      success: function(response) {
        // var image_response = JSON.stringify(response);
        localStorage.setItem('image_response',JSON.stringify(response));
        checkLocalStorage();
      }
    });
  }

  // redirects to cat breed details page if local storage is not empty.
  function checkLocalStorage() {
    if (localStorage.getItem('breed_details') !== null) {
      location.href = 'cat_breed_details.html' 
    } 
  }
  
  //function to display cat breed details and other cat photos once the page is redirected to cat breed details.
  function displayCatBreed() {
    if($('section').hasClass('cat-breed-details')) {
      $('.photos').html('');
      var image_data = JSON.parse(localStorage.getItem('image_response'));
      var breed_info_data = JSON.parse(localStorage.getItem('breed_details'));
      console.log(breed_info_data)
      var cat_breed_name = breed_info_data[0]['name'];
      var cat_breed_description = breed_info_data[0]['description'];
      var cat_temperament = breed_info_data[0]['temperament'];
      var cat_origin = breed_info_data[0]['origin'];
      var cat_life_span = breed_info_data[0]['life_span'];
      var cat_adaptability = breed_info_data[0]['adaptability'];
      var cat_affection_level = breed_info_data[0]['affection_level'];
      var cat_child_friendly = breed_info_data[0]['child_friendly'];
      var cat_grooming = breed_info_data[0]['grooming'];
      var cat_intelligence = breed_info_data[0]['intelligence'];
      var cat_health_issues = breed_info_data[0]['health_issues'];
      var cat_social_needs = breed_info_data[0]['social_needs'];
      var cat_stranger_friendly = breed_info_data[0]['stranger_friendly'];

      //storing cat ratings in an object
      var ratings = {
        adaptability: cat_adaptability,
        affection: cat_affection_level,
        child_friendly: cat_child_friendly,
        grooming: cat_grooming,
        intelligence: cat_intelligence,
        health_issues: cat_health_issues,
        social_needs: cat_social_needs,
        stranger_friendly: cat_stranger_friendly
      }

      $('.breed-name-heading').html(cat_breed_name);
      $('.breed-description').html(cat_breed_description);
      $('.temperament').html(cat_temperament);
      $('.origin').html(cat_origin);
      $('.life-span').html(cat_life_span);

      setRatings(ratings);
      displayOtherPhotos(image_data);
    }
  }

  // sets cat rating according to JSON response value
  function setRatings(ratings) {
    var ratingsTotal = 5;
    for (var rating in ratings) {
      //get percentage
      var rating_percentage = ((ratings[rating] / ratingsTotal) * 100);
      //round to nearest 10
      var rating_percentage_rounded = `${Math.round(rating_percentage / 10) * 10}%`
      $(`.${rating} .rating-inner`).css('width', rating_percentage_rounded);
    }
  }

  //displays other photos of the breed
  function displayOtherPhotos(image_data) {
    var image = image_data.splice(0,1);
    console.log(image);
    var image_url = image[0]['url'];
    var image_alt = image[0]['breeds'][0]['name'];
    console.log(image_alt)
    $('.searched-cat-img').append(`<img src=${image_url} alt='${image_alt} photo'>`)
    $.each(image_data, function (index, value) { 
      var li = document.createElement('li');
      list_items.push(li);
      li.classList.add('other-photo-item');
      $(li).html(`<img src=${value.url}>`);
      $('.photos').append(li);
    });
  }

  displayCatBreed();

  //function to get all breed data
  function getBreeds() {
    $.ajax({  
      type: 'GET',
      url: `https://api.thecatapi.com/v1/breeds`,
      headers: {'x-api-key' : 'c01bb41e-223c-4c42-8d3f-32776d4d64a9'},
      data: 'JSON',
      success: function(response) {
        displayTopBreeds(response);
        getBreedNames(response);
      }
    });
  }

  //function to display top 10 searched breeds
  function displayTopBreeds(response) {
    $('.top-10-breeds').html('');
    var top_10_breed_array = response.slice(0,10);  
    $.each(top_10_breed_array, function (index, cat_breed) { 
      var top_breed_listItem = document.createElement('li');
      top_breed_listItem.classList.add('top-breed-item');
      top_breed_listItem.innerHTML = `
        <figure class="top-breed-figure">
          <img class="top-breed-figure-img" src=${cat_breed.image.url} alt='${cat_breed.name} cat photo'>
        </figure>
        <div class="most-searched-content">
          <h3 class="most-searched--content-heading">${index + 1}. ${cat_breed.name}</h3>
          <p class="most-searched-content-text">${cat_breed.description}</p>
        </div>
      `;
      $('.top-10-breeds').append(top_breed_listItem);
    });
  }

  getBreeds();

  //function to empty local storage 
  function deleteLocalStorageValues() {
    if (localStorage.getItem('breed_details') !== null) {
      localStorage.removeItem('breed_details');
    } 
    if (localStorage.getItem('image_response') !== null) {
      localStorage.removeItem('image_response');
    }
  }
  
  deleteLocalStorageValues();

  // modal for mobile devices
  if($(window).width() < 768) {
    $('.search_input').click(function() {
      $('.modal-container').addClass('active')
    })
  }

  //form validation
  function emptyField(input) {
    input.removeClass('invalid');
    if(input.val() == ''){
      input.addClass('invalid');
      input.next().html('**This field cant be empty!**');
      input.next().slideDown();
      e.preventDefault();
    }
  }

  function validateCatField(xhr) {
    search_input.removeClass('invalid');
    if(search_input.val() == ''){
      emptyField(search_input);
    }
  }

});