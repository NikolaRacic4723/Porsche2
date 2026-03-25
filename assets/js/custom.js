let navigationData = [];
let drivetrainData = [];
let typeData = [];
let powertrainData = [];
let favoriteIds = [];

const FAVORITES_KEY = "porsche_favorites";

$(document).ready(function () {
        loadNav();
    });

function loadNav(){
    $.ajax({
        url: "assets/data/navigation.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            navigationData = data;
            populateNavigation();
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}


function populateNavigation(){
    const nav = $("#idnav");
    nav.empty();
    navigationData.forEach(function(link){
        nav.append(`<li class="nav-item">
                            <a class="nav-link" href="${link.link}">${link.name}</a>
                        </li>`);
    });
}

let pathNameArray = window.location.pathname.split('/')

let pathName = '/'+pathNameArray[pathNameArray.length-1]


if(pathName == '/')
    pathName = '/index.html'

if(pathName == '/index.html'){

    let porscheData = [];
    $(document).ready(function () {
        loadPorsches();
    });

    function loadPorsches() {
    $.ajax({
        url: "assets/data/porsches.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            porscheData = data;
            renderFeatured();
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
    }

    function renderFeatured(){
        const container = $("#featuredCars");

        container.empty();

        porscheData.forEach(function(porsche){
            if (porsche.featured === "true"){
                const card = `<div class="col-12 col-md-4 mb-4">
                    <div class="card h-100">
                        <a href="shop-single.html">
                            <img src="${porsche.image}" class="card-img-top" alt="featured car">
                        </a>
                        <div class="card-body">
                            <ul class="list-unstyled d-flex justify-content-between">
                                <li>
                                    <i class="text-warning fa fa-star"></i>
                                    <i class="text-warning fa fa-star"></i>
                                    <i class="text-warning fa fa-star"></i>
                                    <i class="text-warning fa fa-star"></i>
                                    <i class="text-warning fa fa-star"></i>
                                </li>
                                <li class="text-muted text-right">${porsche.price}</li>
                            </ul>
                            <a href="shop-single.html" class="h2 text-decoration-none text-dark">${porsche.name}</a>
                            <p class="card-text">
                                ${porsche.description}
                            </p>
                            <p class="text-muted">Reviews (24)</p>
                        </div>
                    </div>
                </div>`;
                container.append(card);
        }
        });
    }
}

if(pathName == '/shop.html'){

    let selectedDrivetrain = "all";
    let selectedType = "all";
    let selectedPowertrain = "all";

    $(document).ready(function () {
        loadPorsches();
        loadDrivetrains();
        loadTypes();
        loadPowertrains();
        bindEvents();
        loadFavorites();
    });

    function loadPorsches() {
    $.ajax({
        url: "assets/data/porsches.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            porscheData = data;
            displayShop();
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
    }

    function loadDrivetrains(){
    $.ajax({
        url: "assets/data/drivetrains.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            drivetrainData = data;
            populateCategories();
        },
        error: function (xhr) {
            console.log(xhr);
        }
        });
    }

    function loadTypes(){
        $.ajax({
        url: "assets/data/types.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            typeData = data;
            populateCategories();
        },
        error: function (xhr) {
            console.log(xhr);
        }
        });
    }

    function loadPowertrains(){
        $.ajax({
        url: "assets/data/powertrains.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            powertrainData = data;
            populateCategories();
        },
        error: function (xhr) {
            console.log(xhr);
        }
        });
    }

    function populateCategories(){
    const drop1 = $("#collapseOne");
    const drop2 = $("#collapseTwo");
    const drop3 = $("#collapseThree")
    drop1.empty();
    drop2.empty();
    drop3.empty();
    drivetrainData.forEach(function(drivetrain){
        drop1.append(`<li><a class="text-decoration-none drivetrain-link" href="#" data-drivetrain="${drivetrain.drivetrain}">${drivetrain.drivetrain}</a></li>`);
    });
    typeData.forEach(function(type){
        drop2.append(`<li><a class="text-decoration-none type-link" href="#" data-type="${type.type}">${type.type}</a></li>`);
    });
    powertrainData.forEach(function(powertrain){
        drop3.append(`<li><a class="text-decoration-none powertrain-link" href="#" data-powertrain="${powertrain.powertrain}">${powertrain.powertrain}</a></li>`);
    });
    }

    function loadFavorites() {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);

    if (savedFavorites) {
        try {
            favoriteIds = JSON.parse(savedFavorites);
        } catch (error) {
            favoriteIds = [];
        }
        }
    }

    function bindEvents(){
        $(document).on("click",".select-all", function () {

            selectedDrivetrain = "all";
            selectedType = "all";
            selectedPowertrain = "all";
            
            displayShop();
        });
        $(document).on("click",".drivetrain-link", function () {

            selectedDrivetrain = $(this).data("drivetrain");
            
            displayShop();
        });
        $(document).on("click",".type-link", function () {

            selectedType = $(this).data("type");
            
            displayShop();
        });
        $(document).on("click",".powertrain-link", function () {

            selectedPowertrain = $(this).data("powertrain");
            
            displayShop();
        });
        $("#sortList").on("change", function(){
            displayShop();
        });
        $("#favoritesOnly").on("change", function () {
            displayShop();
        });
        $("#shopPage").on("click",".favorite-btn",function(){
            const porscheId = Number($(this).data("id"));
            FavoriteOnOff(porscheId);
            displayShop();
        });
    }

    function displayShop(){
        const container = $("#shopPage");
        const noResults = $("#noResults");

        container.empty();

        let filteredCars = applyFilter();
        filteredCars = sortCars(filteredCars);

        if (filteredCars.length === 0) {
            noResults.removeClass("hidden");
            return;
        }

        noResults.addClass("hidden");

        // <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="fas fa-cart-plus"></i></a></li> - AKO ZATREBA ZA CART

        filteredCars.forEach(function(porsche){
                const card = `<div class="col-md-4">
                        <div class="card mb-4 product-wap rounded-0 favorite-card">
                            <div class="card rounded-0">
                                <img class="card-img rounded-0 img-fluid" src="${porsche.image}">
                                <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul class="list-unstyled">
                                        <li><a class="btn btn-success text-white favorite-btn" data-id="${porsche.id}"><i class="far fa-heart"></i></a></li>
                                        <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="far fa-eye"></i></a></li>
                                        
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body">
                                <a href="shop-single.html" class="h3 text-decoration-none">${porsche.name}</a>
                                <p class="text-center mb-0">$${porsche.price}</p>
                            </div>
                        </div>
                    </div>`;
                container.append(card);
            });
    }

    function applyFilter() {

        const favoritesOnly = $("#favoritesOnly").is(":checked");

        return porscheData.filter(function (porsche) {
        const matchesDrivetrain =  selectedDrivetrain === "all" || selectedDrivetrain === porsche.drivetrain;
        const matchesType = selectedType === "all" || selectedType === porsche.type;
        const matchesPowertrain = selectedPowertrain === "all" || selectedPowertrain === porsche.powertrain;
        const matchesFavorites = !favoritesOnly || favoriteIds.includes(porsche.id)

        return matchesDrivetrain && matchesType && matchesPowertrain && matchesFavorites;
        });
    }

    function sortCars(porsches){
        const sortValue = $("#sortList").val();
        const sortedCars = [...porsches];

        sortedCars.sort(function(a,b){
            if(sortValue === "ABC"){
                return a.name.localeCompare(b.name);
            }
            if(sortValue === "CostL"){
                return a.price - b.price;
            }
            if(sortValue === "CostH"){
                return b.price - a.price;
            }
            return a.id - b.id;
        });
        return sortedCars;
    }

    function FavoriteOnOff(porscheId) {
    if (favoriteIds.includes(porscheId)) {
        favoriteIds = favoriteIds.filter(function (id) {
            return id !== porscheId;
        });
    }
    else {
        favoriteIds.push(porscheId);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
}
}
 
 //         FORMA
 
    const NAME_REGEX = /^[A-ZŠĆČŽĐ][a-zčćžšđ]{1,15}$/;
    const PHONE_REGEX = /^(\+)?[0-9]{7,15}$/;
    const EMAIL_REGEX = /^[\w\d\.]+@[\w\d\.]+\.[a-zA-Z\d]{2,}$/;
    const MESSAGE_REGEX = /\S+/;
    const fnameInput = document.getElementById("fname");
    const fnameERR = document.getElementById("fnameERR");
    const lnameInput = document.getElementById("lname");
    const lnameERR = document.getElementById("lnameERR");
    const phoneInput = document.getElementById("phone");
    const phoneERR = document.getElementById("phoneERR");
    const emailInput = document.getElementById("email");
    const emailERR = document.getElementById("emailERR");
    const messageInput = document.getElementById("message");
    const messageERR = document.getElementById("messageERR");
if(document.getElementById("formsubmit")){
document.getElementById("formsubmit").addEventListener('click', function (e) {

    e.preventDefault();
    if (!NAME_REGEX.test(fnameInput.value)) {
        fnameERR.textContent = 'First name invalid';
        fnameERR.style.color = 'red';
    } else {
        fnameERR.textContent = '';
    }
    if (!NAME_REGEX.test(lnameInput.value)) {
        lnameERR.textContent = 'Last name invalid';
        lnameERR.style.color = 'red';
    } else {
        lnameERR.textContent = '';
    }
    if (!PHONE_REGEX.test(phoneInput.value)) {
        phoneERR.textContent = 'Phone number can contain only digits';
        phoneERR.style.color = 'red';
    } else {
        phoneERR.textContent = '';
    }
    if (!EMAIL_REGEX.test(emailInput.value)) {
        emailERR.textContent = 'Wrong email, email must be in form like customersupport@porsche.com';
        emailERR.style.color = 'red';
    } else {
        emailERR.textContent = '';
    }
    if (!MESSAGE_REGEX.test(messageInput.value)){
        messageERR.textContent = "Message can not be empty";
        messageERR.style.color = 'red';
    } else {
        messageERR.textContent = '';
    }
})};