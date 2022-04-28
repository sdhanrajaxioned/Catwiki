$(document).ready(function () {
  var search_input = $('#search-breed');
  var search_btn = $('#search-btn');
  var list_items = [];

  //on search button click page redirects to cat breed details page and cat breed info is displayed.
  search_btn.click(function (e) { 
    e.preventDefault();
    getCatInfo();
    location.href = 'cat_breed_details.html'
  });
 
  //function to get cat breed details data from cat api and stores it in local storage and then calls getImages 
  function getCatInfo() {
    $.ajax({
      type: 'GET',
      url: 'https://api.thecatapi.com/v1/breeds/search?q='+search_input.val(),
      headers: {'x-api-key' : 'c01bb41e-223c-4c42-8d3f-32776d4d64a9'},
      data: 'JSON',
      success: function(response) {
        console.log(response);
        var breed_info = JSON.stringify(response);
        localStorage.setItem('breed_details', breed_info);
        // console.log(localStorage)
        var search_input_value = search_input.val().substring(0,4);
        getImages(search_input_value);
      }
    });
  }

  //function to get cat breed images data and stores it in local storage
  function getImages(search_input_value) {
    $.ajax({  
      type: 'GET',
      url: `https://api.thecatapi.com/v1/images/search?breed_id=${search_input_value}&limit=8`,
      headers: {'x-api-key' : 'c01bb41e-223c-4c42-8d3f-32776d4d64a9'},
      data: 'JSON',
      success: function(response) {
        var image_response = JSON.stringify(response);
        localStorage.setItem('imageResponse',image_response);
      }
    });
  }

  //function to display cat breed details and other cat photos once the page is redirected to cat breed details.
  function displayCatBreed() {
    if($('section').hasClass('cat-breed-details')) {
      console.log(localStorage);
      var image_data = JSON.parse(localStorage.getItem('imageResponse'));
      var breed_info_data = JSON.parse(localStorage.getItem('breed_details'));
      console.log(breed_info_data);
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
      $('.temperament').html(cat_temperament);
      $.each(image_data, function (index, value) { 
        var li = document.createElement('li');
        list_items.push(li);
        li.classList.add('other-photo-item');
        $(li).html(`<img src=${value.url}>`);
        $('.photos').append(li);
      });
    }
  }

  displayCatBreed();

});