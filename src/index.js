import './scss/main.scss';

alert("1.0");

var states = { //for catalog page
    categoryList: 1,
    category: 2,//items of category go here
    itemsList: 3,
    item: 4
}

var pages = {
    welcome: 1,
    catalog: 2,
    login: 3,
    register: 4,
    profile: 5,
    about: 6
}

function item(id, quantity) {
    this.id = id;
    this.quantity = quantity;
}

var cart = [];

var links = [
    "#logo_link",
    "#catalog_link",
    "#profile_link",
    "#signin_link",
    "#about_link"
];

var currentPage = pages.welcome;
var currentState = states.categoryList;
var previousState;
var currentCategoryId = 1;
var currentItemId = 1;
var topOffset = 0;
var catTopOffset = 0;
var itemsInPage = 12;

var nameInput = "";
var emailInput = "";
var phoneInput = "";


function initMenus() {
    $("#header_helper").height($("#header_menu").outerHeight());
    $(window).resize(function () {
        $("#header_helper").height($("#header_menu").outerHeight());
    });

    $("#footer_helper").height($("#footer_menu").outerHeight());
    $(window).resize(function () {
        $("#footer_helper").height($("#footer_menu").outerHeight());
    });
}

function setActive(idList, id) {
    for (var i = 0; i < idList.length; i++) {
        $(idList[i]).removeClass("active");
    }
    $(id).addClass("active");
}

function addToCart(id, quantity) {

    if (cart.length <= 0) {
        cart.push(new item(id, 1));
    } else {
        var exists = false;
        for (var i in cart) {
            if (cart[i].id == id) {
                cart[i].quantity += quantity;
                exists = true;
            }
        }
        if (!exists) {
            cart.push(new item(id, 1));
        }
    }


    //---------------------
    var name = "Your item";
    var url_ = "https://nit.tron.net.ua/api/product/" + id;
    $.ajax({
        url: url_,
        type: 'GET',
        dataType: 'json',
        success: function (content) {
            name = content.name;

            $("#catalog").append("<div class='alert'><span>" + name + " was successfully added to your cart!</span></div>");

            setTimeout(function () {
                $('.alert').fadeOut("slow", function () {
                    $(".alert").remove();
                });
            }, 2000);

            $(".alert").click(function () {
                $(this).remove();
            });
        },
        error: function (xhr) {
            $("#catalog").append("<div class='alert'><span>" + name + " was successfully added to your cart!</span></div>");

            setTimeout(function () {
                $('.alert').fadeOut("slow", function () {
                    $(".alert").remove();
                });
            }, 2000);

            $(".alert").click(function () {
                $(this).remove();
            });
        },
    });

    //---------------------


}

function removeFromCart(id, quantity) {
    quantity = quantity || 0;
    if (quantity == 0) {
        for (var i in cart) {
            if (cart[i].id === id) {
                cart.splice(i, 1);
                return;
            }
        }
    } else {
        for (var i in cart) {
            if (cart[i].id == id) {
                cart[i].quantity += quantity;
                if (cart[i].quantity <= 1) cart[i].quantity = 1;
            }
        }
    }
}

function getQuantity(id) {
    for (var i in cart) {
        if (cart[i].id == id) {
            return cart[i].quantity;
        }
    }
    return 0;
}

function arrayPrint() {
    var s = "";
    for (var i in cart) {
        s += cart[i].id + " -> " + cart[i].quantity + "\n";
    }
    //alert(s);
}

function pageReload(currentPage) {
    $("#content").empty();
    if (currentPage == pages.welcome) {
        $("#content").html("<div id='welcome'>(TODO)Welcome page</div>")
    } else if (currentPage == pages.login) {
        $("#content").html("<div id='login'>(TODO)Login page</div>")
    } else if (currentPage == pages.register) {
        $("#content").html("<div id='register'>(TODO)Register page</div>")
    } else if (currentPage == pages.profile) {
        $("#content").append("<div id='filter_menu'>Profile page</div>");

        $("#content").append("<div id='container'></div>");//divide screen into 2/3 and 1/2 
        //2/3 for order div and 1/3 for submit button(when mobile they collapse into column)
        $("#container").append("<div id='order'>No items in your cart!</div>");
        $("#container").append("<div id='submit_order'></div>")

        $("#submit_order").append("\
            <p>Name: <input class='checkInput' id='input_name' placeholder='Name' type='text' value='"+ nameInput + "' required></p>\
            <p>Phone: +38<input class='checkInput' id='tel' placeholder='067-630-55-69' value='"+ phoneInput + "' type='tel' required></p>\
            <p>Email: <input class='checkInput' id='mail' type='email' value='"+ emailInput + "' placeholder='Email' required></p>\
            <button id='submit_button' >Submit order</button>\
        ");

        $("#input_name").on("change paste keyup", function () {
            nameInput = $("#input_name").val();
        });

        $("#tel").on("change paste keyup", function () {
            phoneInput = $("#tel").val();
        });

        $("#mail").on("change paste keyup", function () {
            emailInput = $("#mail").val();
        });


        $("#submit_button").click(function () {
            var dataStruct = {
                token: "_5Uln5xxlVh4oypPpkUW",
                name: $("#input_name").val(),
                phone: $("#tel").val(),
                email: $("#mail").val(),
            };


            if (dataStruct.name.length >= 2) {

                //+38 067 630 55 69
                var phoneno = new RegExp("^0([0-9]{2})[-. ]{0,1}([0-9]{3})[-. ]{0,1}([0-9]{2})[-. ]{0,1}([0-9]{2})$");

                if (phoneno.test(dataStruct.phone)) {

                    var mailr = new RegExp("^([a-zA-Z0-9._-]+)@([a-zA-Z0-9]+)[.]([a-zA-Z]+)$");

                    if (mailr.test(dataStruct.email)) {

                        //products[1]=3&products[2]=2&name=...&token=...&...
                        var dataJ = "token=" + dataStruct.token + "&name=" + dataStruct.name + "&phone=+38" + dataStruct.phone +
                            "&email=" + dataStruct.email;
                        for (var i in cart) {
                            dataJ += "&products[" + cart[i].id + "]=" + cart[i].quantity;
                        }

                        console.log(dataJ);

                        if (cart.length >= 1) {

                            $.ajax({
                                url: 'https://nit.tron.net.ua/api/order/add',
                                type: 'POST',
                                data: dataJ,
                                dataType: 'json',
                                success: function (json) {

                                    $("#container").append("<div class='alert'><span>Your order was succesfully created!We will deliver your order within few days.</span></div>");

                                    setTimeout(function () {
                                        $('.alert').fadeOut("slow", function () {
                                            $(".alert").remove();
                                        });
                                    }, 2000);

                                    $(".alert").click(function () {
                                        $(this).remove();
                                    });
                                    console.log(json.status || 'Unexpected...');
                                },
                                error: function (xhr) {
                                    alert('Error while loading data!');
                                },
                            });


                        }

                    } else {
                        alert("Wrong email format!");
                    }

                }
                else {
                    alert("Wrong phone number format!");
                }

            } else {
                alert("Name can't be empty!");
            }




        });


        if (cart.length >= 1) {
            $("#order").empty();

        }

        $(document).off("click", ".removeFromCart");
        $(document).off("click", ".minusBtn");
        $(document).off("click", ".plusBtn");

        var totalPrice = 0;
        var n = 0;
        for (var i in cart) {

            //alert(cart[i].quantity);

            var url_ = "https://nit.tron.net.ua/api/product/" + cart[i].id;
            $.ajax({
                url: url_,
                type: 'GET',
                dataType: 'json',
                success: function (content) {

                    name = content.name;
                    var price = content.price;
                    if (content.special_price != null) {
                        price = content.special_price;
                    }


                    totalPrice += (getQuantity(content.id) * price);

                    var total = "";

                    if (n + 1 == cart.length) {
                        total = "Total: " + totalPrice + "uah";
                    }
                    n++;

                    $("#order").append(
                        "<div class= 'order_item' >\
                        <div>\
                            <button class='removeFromCart' id='" + content.id + "'>x</button>\
                            <button class='minusBtn' id='" + content.id + "'>-</button>\
                            <span id='span" + content.id + "'>  " + getQuantity(content.id) + "</span>\
                            <button class='plusBtn' id='" + content.id + "'>+</button>\
                        </div>\
                        <div>"
                        + name + "(" + price + "uah) - " + (getQuantity(content.id) * price) + "uah" +
                        "</div>\
                    </div>\
                    <div class='order_item'>"
                        + total +
                        "</div>"
                    );
                },
                error: function (xhr) {
                    alert("error")
                },
            });

        }



        $(document).on("click", ".removeFromCart", function (event) {
            var id = event.target.id;
            removeFromCart(id, 0);
            arrayPrint();
            $(window).trigger("customReloadCatalog");
        });

        $(document).on("click", ".minusBtn", function (event) {
            var id = event.target.id;
            removeFromCart(id, -1);



            $("#span" + id).text(getQuantity(id));
            $(window).trigger("customReloadCatalog");
            //$(window).trigger("customReloadCatalog");
        });

        $(document).on("click", ".plusBtn", function (event) {
            var id = event.target.id;
            removeFromCart(id, 1);

            $("#span" + id).text(getQuantity(id));
            $(window).trigger("customReloadCatalog");
            //$(window).trigger("customReloadCatalog");
        });

    } else if (currentPage == pages.about) {
        $("#content").append("\
    <div id='aboutus'>\
        <p class='title'>Black&White</p>\
        <p class='description'>Black&White is a new online clothes shop, designed specially for teens and\
            youth.With it's outstanding\
            procuts and quality it is the favourite shop for young people,who always want to be stylish and\
            confident.Established in 2018,it has proven that people love the shop and it's products.If you want\
            some additional information,feel free to contact us:\
        </p>\
        <div id='social'>\
            <button><a href='mailto:bandw@support.com'>\
                bandw@support.com\
            </a></button>\
            <button><a href='tel:+380676305569'>\
                +380676305569\
            </a></button>\
            <button id='fb-share'><a href='https://www.facebook.com/sharer/sharer.php?u=bandw.com' target='_blank'>\
                    Share\
                </a></button>\
            <button id='tweet'><a href='https://twitter.com/share?ref_src=twsrc%5Etfw' data-size='large' data-lang='uk'\
                    data-show-count='false' target='_blank'>Tweet</a>\
                <script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script></button>\
        </div>\
    </div>\
    ");

    } else if (currentPage == pages.catalog) {


        //draw the upper menu first

        $("#content").append("<div id='catalog'></div>");

        $("#catalog").append("<div id='filter_menu'></div>");


        //then in list draw smth
        if (currentState == states.categoryList) {

            $("#filter_menu").append("<span>List of all categories:</span>")
            $("#filter_menu").append("<button id='all_items'>All items</button>");

            $("#catalog").append("<div id='list'></div>");

            $("#all_items").click(function () {
                previousState = currentState;
                currentState = states.itemsList;
                $(window).trigger("customReloadCatalog");
            });

            $(window).scroll(function () {
                catTopOffset = $(window).scrollTop();
            });

            $.ajax({
                url: 'https://nit.tron.net.ua/api/category/list',
                type: 'GET',
                dataType: 'json',
                success: function (content) {
                    var categories = content;

                    for (var j = 0; j < categories.length; j++) {

                        $("#list").append(
                            "<div class='category_card' id='" + categories[j].id + "'>\
                            <p class='category_link'>" + categories[j].name + "</p>\
                        </div>");

                    }

                    if (previousState == states.category || previousState == states.itemsList) {

                        $(window).scrollTop(catTopOffset);

                    }

                    $(".category_link").click(function () {
                        currentCategoryId = $(this).parent().attr('id');

                        previousState = currentState;
                        currentState = states.category;
                        $(window).unbind("scroll");
                        $(window).trigger("customReloadCatalog");
                    });

                    $(".category_card").click(function () {
                        currentCategoryId = $(this).attr('id');

                        previousState = currentState;
                        currentState = states.category;
                        $(window).unbind("scroll");
                        $(window).trigger("customReloadCatalog");
                    });
                },
                error: function (xhr) {
                    alert('Error while loading data!');
                },
            });


        } else if (currentState == states.category) {

            $("#catalog").empty();
            $("#catalog").append("<div id='filter_menu'></div>");
            $("#filter_menu").append("<button id='back_category'>< Back to all categories</button>")


            $(window).scroll(function () {
                topOffset = $(window).scrollTop();
            });

            $("#back_category").click(function () {

                previousState = currentState;
                currentState = states.categoryList;
                $(window).trigger("customReloadCatalog");
            });

            $.ajax({
                url: 'https://nit.tron.net.ua/api/category/' + currentCategoryId,
                type: 'GET',
                dataType: 'json',
                success: function (content) {

                    var info = {
                        name: content.name,
                        description: content.description
                    }

                    //$("#filter_menu").append("<span>\"" + info.name + "\" category:</span>");
                    $("#catalog").append("<div id='cat_info'>\
                        <p>Category name: " + info.name + "</p>\
                        <p>Description: " + info.description + "</p>\
                    </div>")

                    $("#catalog").append("<div id='list'></div>");


                    $.ajax({
                        url: 'https://nit.tron.net.ua/api/product/list/category/' + currentCategoryId,
                        type: 'GET',
                        dataType: 'json',
                        success: function (content) {

                            var items = content

                            for (var j = 0; j < items.length; j++) {

                                var pr = "<p class='item_price'>" + items[j].price + "uah</p>";
                                if (items[j].special_price != null) {
                                    pr = "<p class='item_price' ><span style='text-decoration: line-through;'>" + items[j].price + "uah </span><span>" + items[j].special_price + "uah</span></p>";
                                }

                                $("#list").append(
                                    "<div class='card'>\
                                    <div class='cont' id='"+ items[j].id + "'>\
                                        <div class='img_div'>\
                                            <img src='" + items[j].image_url + "'>\
                                        </div>\
                                        <p style='cursor:pointer;' class='item_name'>" + items[j].name + "</p>"
                                    + pr +
                                    "<div class='item_btn_container'>\
                                            <button class='item_basket_add' id='" + items[j].id + "'>Add to cart</button>\
                                        </div>\
                                    </div>\
                                </div>");

                            }

                            $(".item_basket_add").on("click", function () {
                                var id = $(this).attr('id');
                                //alert("Your item was successfully added to the cart!");
                                addToCart(id, 0);
                            });

                            $(".img_div").on("click", function () {
                                currentItemId = $(this).parent().attr('id');
                                previousState = currentState;
                                currentState = states.item;
                                $(window).unbind("scroll");
                                $(window).trigger("customReloadCatalog");
                            });

                            $(".item_name").on("click", function () {
                                currentItemId = $(this).parent().attr('id');
                                previousState = currentState;
                                currentState = states.item;
                                $(window).unbind("scroll");
                                $(window).trigger("customReloadCatalog");
                            });

                            if (previousState == states.item) {

                                $(window).scrollTop(topOffset);

                            }

                        },
                        error: function (xhr) {
                            alert('Error while loading data!');
                        },
                    });

                },
                error: function (xhr) {
                    alert('Error while loading data!');
                },
            });

        } else if (currentState == states.itemsList) { //all items

            $("#filter_menu").append("<span>List of all items:</span>");
            $("#filter_menu").append("<button id='all_categories'>All categories</button>");
            $("#catalog").append("<div id='list'></div>");

            $("#all_categories").click(function () {

                previousState = currentState;
                currentState = states.categoryList;

                $(window).trigger("customReloadCatalog");
            });

            $(window).scroll(function () {
                topOffset = $(window).scrollTop();
            });

            $.ajax({
                url: 'https://nit.tron.net.ua/api/product/list',
                type: 'GET',
                dataType: 'json',
                success: function (content) {

                    var items = content

                    for (var j = 0; j < items.length; j++) {

                        var pr = "<p class='item_price'>" + items[j].price + "uah</p>";
                        if (items[j].special_price != null) {
                            pr = "<p class='item_price' ><span style='text-decoration: line-through;'>" + items[j].price + "uah </span><span>" + items[j].special_price + "uah</span></p>";
                        }

                        $("#list").append(
                            "<div class='card'>\
                            <div class='cont' id='"+ items[j].id + "'>\
                                <div class='img_div'>\
                                    <img src='" + items[j].image_url + "'>\
                                </div>\
                                <p style='cursor:pointer;' class='item_name'>" + items[j].name + "</p>"
                            + pr +
                            "<div class='item_btn_container'>\
                                    <button class='item_basket_add' id='" + items[j].id + "'>Add to cart</button>\
                                </div>\
                            </div>\
                        </div>");

                    }

                    $(".item_basket_add").on("click", function () {
                        var id = $(this).attr('id');
                        //alert("Your item was successfully added to the cart!");
                        addToCart(id, 0);
                    });


                    $(".img_div").on("click", function () {
                        currentItemId = $(this).parent().attr('id');
                        previousState = currentState;
                        currentState = states.item;
                        $(window).unbind("scroll");
                        $(window).trigger("customReloadCatalog");
                    });

                    $(".item_name").on("click", function () {
                        currentItemId = $(this).parent().attr('id');
                        previousState = currentState;
                        currentState = states.item;
                        $(window).unbind("scroll");
                        $(window).trigger("customReloadCatalog");
                    });

                    if (previousState == states.item) {

                        $(window).scrollTop(topOffset);

                    }

                },
                error: function (xhr) {
                    alert('Error while loading data!');
                },
            });

        } else if (currentState == states.item) {



            var url_ = "https://nit.tron.net.ua/api/product/" + currentItemId;
            $.ajax({
                url: url_,
                type: 'GET',
                dataType: 'json',
                success: function (content) {

                    var item = content;
                    var back = "all items";
                    if (previousState == states.category) {
                        back = "category";
                    }
                    $("#catalog").empty();
                    $("#catalog").append("<div id='filter_menu'></div>");
                    $("#filter_menu").append("<button id='back_item'>< Back to " + back + "</button>")
                    $("#catalog").append("<div id='item_page'></div>")
                    $("#back_item").click(function () {
                        currentState = previousState;
                        previousState = states.item;

                        $(window).trigger("customReloadCatalog");
                    });

                    var prrice = "<div id='price_and_button'><p>" + item.price + "uah";
                    if (item.special_price != null) {
                        prrice = "<div id='price_and_button'><p><span style='text-decoration: line-through;'>" + item.price + "uah</span><span>" + item.special_price + "uah</span>";

                    }

                    prrice += "</p>";

                    $("#item_page").append("\
                        <img src='" + item.image_url + "'>\
                        <p>" + item.name + "</p>\
                        <p id='desc'>"+ item.description + "</p>"
                        + prrice + "<button class='item_basket_add' id='" + item.id + "'>Add to cart</button></div>\
                    ");

                    $(".item_basket_add").click(function () {
                        var id = $(this).attr('id');
                        //alert("Your item was successfully added to the cart!");
                        addToCart(id, 0);
                    });

                },
                error: function (xhr) {
                    alert('Error while loading data!');
                },
            });



        }


    }
}

$(document).ready(function () {

    initMenus();

    pageReload(currentPage);

    $("#logo_link").click(function () {
        currentPage = pages.welcome;
        setActive(links, links[0]);
        pageReload(currentPage);
    });

    $(".header img").click(function () {
        currentPage = pages.welcome;
        setActive(links, links[0]);
        pageReload(currentPage);
    })

    $("#catalog_link").click(function () {
        currentPage = pages.catalog;
        currentState = states.categoryList;
        previousState = states.categoryList;
        setActive(links, links[1]);
        pageReload(currentPage);
    });

    $("#profile_link").click(function () {
        currentPage = pages.profile;
        setActive(links, links[2]);
        pageReload(currentPage);
    });

    $("#signin_link").click(function () {
        currentPage = pages.login;
        setActive(links, links[3]);
        pageReload(currentPage);
    });

    $("#about_link").click(function () {
        currentPage = pages.about;
        setActive(links, links[4]);
        pageReload(currentPage);
    });


    $(window).on("customReloadCatalog", function () {
        pageReload(currentPage);
    });


    /*
       $.ajax({
        url: '/api/product/2/edit',
        type: 'POST',
        data: 'name=NewProductName&price=499',
        dataType: 'json',
        success: function(json){
            console.log(json.status || 'Unexpected...');
        },
        error: function(xhr){
            alert('Error while loading data!');
        },
    });*/

});