$(document).ready(function() {
    // search when clicked 
    $("#searchSubmitBtn").click(function (e) { 
        e.preventDefault();
    
    // get data from html and build the search query
        type = $('#searchType').val();
        query = $('#searchInput').val();
        let searchQuery = `https://api.themoviedb.org/3/search/${type}/?api_key=${movieAPIKey}&language=en-US&page=1&include_adult=false&query=${query}`;
    
    // request api 
        $.get(searchQuery, function(data, status) {
            // clear old results and show how many results are shown and found
            $('#resultsDiv').empty()
            $('#resultsDiv').append("<br><span> Showing: ", Object.keys(data.results).length ,' of ', data.total_results, ' results.', "</span>");

            // list results
            switch (type) {
                case 'movie':
                    data.results.forEach(element => {
                        $("<div .movieResultDiv></div>").attr("id", `${element.id}`).appendTo('#resultsDiv');
                            $("<p></p>").append(element.title).appendTo(`div#${element.id}`);
                            $("<p></p>").append(element.release_date).appendTo(`div#${element.id}`);
                            $("<p></p>").append(element.original_language).appendTo(`div#${element.id}`);
                            $("<p></p>").append("**************************************").appendTo(`div#${element.id}`);
                });
                case 'person': 
                console.log(data)
                    data.results.forEach(element => {
                        // save id for later should look into using the data attribute
                        $("<div></div>").attr({id:`${element.id}`, class:'personResultDiv'}).appendTo('#resultsDiv');
                        $("<p></p>").append(element.name).appendTo(`div#${element.id}`);
                        $("<p></p>").append(element.known_for_department).appendTo(`div#${element.id}`);
                        
                        // request image
                        $.get(`https://api.themoviedb.org/3/configuration?api_key=${movieAPIKey}`, function(data, status) {
                            baseURL = data.images.base_url;
                            imgSize = data.images.backdrop_sizes[0]; // 'w300', 'w780', 'w1280', 'original'
                            request = baseURL + imgSize + element.profile_path;
                            $(`<img src='${request}' width="300">`).appendTo(`div#${element.id}`);
                        });
                    });
                default:
                break;
            }
        });
    });

    // modal
    $(document).on("click", ".personResultDiv", function(e) {    

        // build new query
        type = $('#searchType').val() + `/${this.id}`;
        let searchPersonById = `https://api.themoviedb.org/3/${type}/?api_key=${movieAPIKey}&language=en-US&append_to_response=movie_credits`;
        
        // send request, build and show modal
        $.get(searchPersonById, function(data,status) {

            //build the modal with data
            $('<h3></h3>').append(data.name).appendTo('#modalInner');
            $('<p></p>').append(data.known_for_department).appendTo('#modalInner');
            $('<p></p>').append(data.birthday).appendTo('#modalInner');
            $('<p></p>').append(data.place_of_birth).appendTo('#modalInner');
    
            // check deathday make a switch
            if (data['deathday'] === null) {
                 console.log("No deathday");
                } else {
                $('<p></p>').append(data.deathday).appendTo('#modalInner');
            };

            // add more data 
            $('<p></p>').append(data.biography).appendTo('#modalInner');
            $('<p></p>').append(data.homepage).appendTo('#modalInner');

            // worked in 
            $('<p></p>').append("Worked in: ").appendTo('#modalInner');
            data.movie_credits.cast.forEach(element => {
                $('<p></p>').append('Title: ',element.original_title,', Release ', element.release_date, ', Role: ', element.character,'.').appendTo('#modalInner')
            });
            // show modal
            $('.modalHidden').addClass('modalShown');
            $('.modalHidden').removeClass('modalHidden');
        });
    });
    
    // close modal
    $('.closeBtn, .modalShown').click(function(e) {
        $('.modalShown').addClass('modalHidden');
        $('.modalShown').removeClass('modalShown');
    });

});
