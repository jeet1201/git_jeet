function initialize() {
}

function sendRequest() {
    var xhr = new XMLHttpRequest();
    var query = encodeURI(document.getElementById("form-input").value);
    xhr.open("GET", "proxy.php?method=/3/search/movie&query=" + query);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var json = JSON.parse(this.responseText);
            //var count=JSON.stringify(json,undefined,2);
            printName(json);
        }
    };
    xhr.send(null);
}


function printName(json)
{
    document.getElementById("output").innerHTML = "";
    document.getElementById("output1").innerHTML = "";
    for (var i = 0; i < json.results.length; i++)
    {
        document.getElementById("output").innerHTML += "<pre onclick='display_info(" + json.results[i].id + ")'> <a href='#'>" + json.results[i].original_title + ": " + json.results[i].release_date + "</a></pre>";
    }
}


function display_info(id) {
    var xhr = new XMLHttpRequest();
    var query = id;
    xhr.open("GET", "proxy.php?method=/3/movie/" + query);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var json = JSON.parse(this.responseText);
            // console.log(json);



            document.getElementById("output1").innerHTML = "<img src= http://image.tmdb.org/t/p/w300//" + json.backdrop_path + " alt='   No image available '><br><br>";
            document.getElementById("output1").innerHTML += "<b>TITLE:</b>"
            document.getElementById("output1").innerHTML += "<div>" + json.original_title + "</div> <br>";


            document.getElementById("output1").innerHTML += "<b> GENRES: </b><br>"
            document.getElementById("output1").innerHTML += "<div>";
            if (json.genres.length == 0)
            {
                document.getElementById("output1").innerHTML += "No Genre available";

            } else
                for (var i = 0; i < json.genres.length; i++)
                {
                    if (i == json.genres.length - 1)
                    {
                        document.getElementById("output1").innerHTML += json.genres[i].name;
                        break;
                    } else
                        document.getElementById("output1").innerHTML += json.genres[i].name + " , ";
                }
            document.getElementById("output1").innerHTML += "</div>";

            document.getElementById("output1").innerHTML += "<br><br><b>SUMMARY:</b><br>";
            if (!json.overview)
            {
                document.getElementById("output1").innerHTML += "No summary available <br>"
            } else
                document.getElementById("output1").innerHTML += "<div>" + json.overview + "</div>";
            cast(query);
        }
    };
    xhr.send(null);
}


function cast(id)
{

    var xhr = new XMLHttpRequest();
    var query = id; 
    xhr.open("GET", "proxy.php?method=/3/movie/" + query + "/credits");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function ()
    {
        if (this.readyState == 4) {
            var json = JSON.parse(this.responseText);
            console.log(json);
            document.getElementById("output1").innerHTML += "<br><b>CHARACTERS:</b><br>"
            for (var i = 0; i < 5; i++)
            {
                if (!json.cast[i].character)
                {
                    document.getElementById("output1").innerHTML += " No character data available but the cast is: " + json.cast[i].name + "<br>";

                } else
                    document.getElementById("output1").innerHTML += json.cast[i].character + " played by  " + json.cast[i].name + "</br>";
            }
        }
   
    };
    xhr.send(null);
}







