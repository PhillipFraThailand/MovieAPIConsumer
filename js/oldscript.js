$(document).ready(function() {
    
    // variable to save json globally
     window.dataGlobal = {};

    // takes in data from an async call and saves it globally when the data is ready
    function saveGlobally(data) {
        dataGlobal = data;
        console.log(dataGlobal)
    }

    // search when clicked 
    $("#searchSubmitBtn").click(function (e) { 
        e.preventDefault();
    
    // get data from html
    type = $('#searchType').val();
    query = $('#searchInput').val();
    let searchQuery = `https://api.themoviedb.org/3/search/${type}/?api_key=${movieAPIKey}&language=en-US&page=1&include_adult=false&query=${query}`;
    console.log(searchQuery)
    
    // request to api 
        $.get(searchQuery, function(data, status) {
            console.log(status)

            // save data globally for other functions
            saveGlobally(data);

            // clear old results
            $('#resultsDiv').empty()

            // show response meta
            $('#resultsDiv').append("<span> Results: ", data.total_results, "</span>")                  //20 results is max due to pagination
            $('#resultsDiv').append("<span> Page: ", data.page, '/', data.total_pages, "</span>" )      //20 results is max due to pagination

            // present data
            switch (type) {
                case 'movie':
                    data.results.forEach(element => {                                                   // maybe save all the data i need here so i dont need to do another get
                        let id = element.id;
                        $("<div .movieResultDiv></div>").attr('id', `${id}`).appendTo('#resultsDiv');
                            $("<p></p>").append(element.title).appendTo(`div#${id}`)                    // maybe add original title if title != original_title
                            $("<p></p>").append(element.release_date).appendTo(`div#${id}`)
                            $("<p></p>").append(element.original_language).appendTo(`div#${id}`)        // switch case and write out language?
                            $("<p></p>").append("**************************************").appendTo(`div#${id}`)
                    });
                    break;

                case 'person': 
                    data.results.forEach(element => {
                        let id = element.id;
                        $("<div></div>").attr({id:`${id}`, class:'personResultDiv'}).appendTo('#resultsDiv');
                            $("<p></p>").append(element.name).appendTo(`div#${id}`);
                            $("<p></p>").append(element.known_for_department).appendTo(`div#${id}`);
                            $("<p></p>").append("*************************************").appendTo(`div#${id}`);
                    });
                default:
                break;
            }
        });

    });
});

// show modal
// Name, main activity, birthday, birthplace, day of decease if dead, biography, link to website. 
// list of movies person has worked in, for each movie; show title, release year, and role (actor, director, script writer)
$(document).on("click", ".personResultDiv", function(e) {
    currentObject = filterById(dataGlobal.results,this.id)

    // apparently the prior search did not retrieve all data on the person. so we need a new request.
    type = $('#searchType').val() + `/${this.id}`;
    let searchPersonById = `https://api.themoviedb.org/3/${type}/?api_key=${movieAPIKey}&language=en-US`;

    console.log(searchPersonById)
    // send request
    $.get(searchPersonById, function(data,status){
        console.log(data)     
    });

    //build the modal with data
    $('<p></p>').append(currentObject.name).appendTo('#modalInner')
    $('<p></p>').append(currentObject.known_for_department).appendTo('#modalInner')

    $('.modalHidden').addClass('modalShown');
    $('.modalHidden').removeClass('modalHidden');
});

// filters through json array  
function filterById(jsonObject, id) {
    return jsonObject.filter(function(jsonObject) {
        return (jsonObject['id'] == id)
        ;})
    [0];}

// close modal
$('.closeBtn, .modalShown').click(function(e){
    $('.modalShown').addClass('modalHidden')
    $('.modalShown').removeClass('modalShown')
});