<?php require APPROOT . '/views/includes/head.php'; ?>
<header class="header position-sticky  top-0 js-header" id="navbar">
    <div class="header__container container max-width-lg">
        <div class="header__logo">
            <a href="#title">
                <img class="logo-image" src="<?=URLROOT ?>public\img\logo\PIzzaLogo2.png" alt="Logo Image">
            </a>
        </div>
        <h1 id="title" class="text-center text-4xl"><?= $data['title']; ?></h1>
        <button class="btn btn--subtle header__trigger js-header__trigger" aria-label="Toggle menu"
            aria-expanded="false" aria-controls="header-nav">
            <i class="header__trigger-icon" aria-hidden="true"></i>
            <span>Menu</span>
        </button>
        <nav style="display:flex;" class="header__nav js-header__nav" id="header-nav" role="navigation"
            aria-label="Main">
            <div class="grid gap-sm">
                <div class="header__nav-inner col-6@sm">
                    <div class="header__label">Main menu</div>
                    <ul class="header__list">
                        <img class="shoppingcart" src="<?= URLROOT ?>public\img\shopping-cart.png" alt=""
                            aria-controls="drawer-cart-id">
                    </ul>
                </div>
                <button class="reset user-menu-control col-6@sm" aria-controls="user-menu"
                    aria-label="Toggle user menu">
                    <figure class="user-menu-control__img-wrapper radius-50%">
                        <img class="user-menu-control__img" src="<?= URLROOT ?>public\img\user_icon_149329.png"
                            alt="User picture">
                    </figure>

                    <svg class="icon icon--xxs margin-left-xxs" aria-hidden="true" viewBox="0 0 12 12">
                        <polyline points="1 4 6 9 11 4" fill="none" stroke="currentColor" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="2" />
                    </svg>
                </button>
            </div>
        </nav>

        <menu id="user-menu" class="menu js-menu">
            <li role="menuitem">
                <a class="menu__content js-menu__content" href="#0">
                    <svg class="icon menu__icon" aria-hidden="true" viewBox="0 0 16 16">
                        <circle cx="8" cy="3.5" r="3.5" />
                        <path
                            d="M14.747,14.15a6.995,6.995,0,0,0-13.494,0A1.428,1.428,0,0,0,1.5,15.4a1.531,1.531,0,0,0,1.209.6H13.288a1.531,1.531,0,0,0,1.209-.6A1.428,1.428,0,0,0,14.747,14.15Z" />
                    </svg>
                    <span>Profile</span>
                </a>
            </li>
            <li class="menu__separator" role="separator"></li>

            <li role="menuitem">
                <a class="menu__content js-menu__content" href="#0">Logout</a>
            </li>
        </menu>
    </div>
</header>
<div data-toast-interval="3000" class="toast toast--hidden toast--top-left js-toast" role="alert" aria-live="assertive"
    aria-atomic="true" id="toast-1">
    <div class="flex items-start justify-between">
        <div class="toast__icon-wrapper toast__icon-wrapper--success margin-right-xs">
            <svg class="icon" viewBox="0 0 16 16">
                <title>Success</title>
                <g>
                    <path
                        d="M6,15a1,1,0,0,1-.707-.293l-5-5A1,1,0,1,1,1.707,8.293L5.86,12.445,14.178.431a1,1,0,1,1,1.644,1.138l-9,13A1,1,0,0,1,6.09,15C6.06,15,6.03,15,6,15Z">
                    </path>
                </g>
            </svg>
        </div>
        <div class="text-component text-sm">
            <h1 class="toast__title text-md">Thank you</h1>
            <p class="toast__p"></p>
        </div>
        <button class="reset toast__close-btn margin-left-xxxxs js-toast__close-btn js-tab-focus">
            <svg class="icon" viewBox="0 0 12 12">
                <title>Close notification</title>
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <line x1="1" y1="1" x2="11" y2="11" />
                    <line x1="11" y1="1" x2="1" y2="11" />
                </g>
            </svg>
        </button>
    </div>
</div>

<div class="slideshow-pm padding-y-md js-slideshow-pm" id="slider" data-swipe="on" data-pm-nav="on">
    <p class="sr-only">Slideshow items</p>

    <div class="slideshow-pm__content">
        <ul class="slideshow-pm__list js-slideshow-pm__list">
            <?php foreach ($data['promos'] as $promos) : ?>
            <li class="slideshow-pm__item js-slideshow-pm__item">
                <div class="aspect-ratio-16:9 width-100%">
                    <div class="flex flex-center width-100% padding-md">
                        <img src="<?= URLROOT . $promos->promotionPathA; ?>" alt="Your Image Description">
                    </div>
                </div>
            </li>
            <?php endforeach; ?>
        </ul>
        <ul>
            <li class="slideshow-pm__control-wrapper js-slideshow-pm__control-wrapper">
                <button class="slideshow-pm__control reset js-tab-focus">
                    <svg class="icon" viewBox="0 0 30 30">
                        <title>Show previous slide</title>
                        <g fill="currentColor">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" d="M19 1L9 15l10 14"></path>
                        </g>
                    </svg>
                </button>
            </li>

            <li class="slideshow-pm__control-wrapper js-slideshow-pm__control-wrapper">
                <button class="slideshow-pm__control reset js-tab-focus">
                    <svg class="icon" viewBox="0 0 30 30">
                        <title>Show next slide</title>
                        <g fill="currentColor">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" d="M11 1l10 14-10 14"></path>
                        </g>
                    </svg>
                </button>
            </li>
        </ul>
    </div>
</div>
<div class="filter-nav filter-nav--v1 filter-nav--expanded js-filter-nav">
    <button class="reset btn btn--subtle is-hidden js-filter-nav__control" aria-label="Select a filter option"
        aria-controls="filter-nav">
        <span class="js-filter-nav__placeholder" aria-hidden="true">All Products</span>
        <svg class="icon icon--xxs margin-left-xxs" aria-hidden="true" viewBox="0 0 12 12">
            <polyline points="1 4 6 9 11 4" fill="none" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="2" />
        </svg>
    </button>
    <div class="filter-nav__wrapper js-filter-nav__wrapper" id="filter-nav">
        <nav class="filter-nav__nav justify-center js-filter-nav__nav">
            <ul class="filter-nav__list js-filter-nav__list" aria-controls="product-gallery">
                <li class="filter-nav__item">
                    <button class="reset filter-nav__btn js-filter-nav__btn js-tab-focus" aria-current="true"
                        data-filter="pizzas">Pizzas</button>
                </li>
                <li class="filter-nav__item">
                    <button class="reset filter-nav__btn js-filter-nav__btn js-tab-focus"
                        data-filter="drinks">Drinks</button>
                </li>
                <li class="filter-nav__item">
                    <button class="reset filter-nav__btn js-filter-nav__btn js-tab-focus"
                        data-filter="snacks">Snacks</button>
                </li>
                <li class="filter-nav__marker js-filter-nav__marker" aria-hidden="true"></li>
            </ul>
            <button class="reset filter-nav__close-btn is-hidden js-filter-nav__close-btn js-tab-focus"
                aria-label="Close navigation">
                <svg class="icon icon--xs" viewBox="0 0 16 16">
                    <title>Close drawer panel</title>
                    <g stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"
                        stroke-miterlimit="10">
                        <line x1="13.5" y1="2.5" x2="2.5" y2="13.5"></line>
                        <line x1="2.5" y1="2.5" x2="13.5" y2="13.5"></line>
                    </g>
                </svg>
            </button>
        </nav>
    </div>
</div>
<br>
<div class="container max-width-adaptive-sm" style="display: flex;">
    <div class="grid gap-sm">
        <?php foreach ($data['pizza'] as $pizza) : ?>
        <div class="card col-6@sm" data-category="pizzas">
            <figure class="card__img-wrapper">
                <img src="<?= URLROOT . $pizza->productPath ?>" alt="">
            </figure>
            <div class="padding-xs">
                <input type="hidden" value="<?= $pizza->productId ?>">
                <h4><?= $pizza->productname; ?></h4>
                <p class="margin-top-xs margin-bottom-sm text-sm color-contrast-medium line-height-md">
                    €<?= $pizza->productPrice ?></p>
                <button class="btn btn--primary text-sm width-100% addToCartBtn">Add To Cart</button>
                <input type="hidden" class="productId" value="<?=$pizza->productId ?>">
                <input type="hidden" class="productname" value="<?=$pizza->productname ?>">
                <input type="hidden" class="productPrice" value="<?=$pizza->productPrice ?>">
                <input type="hidden" class="productPath" value="<?=$pizza->productPath ?>">
            </div>
        </div>
        <?php endforeach; ?>
        <?php foreach ($data['drinks'] as $drink) : ?>
        <div class="card col-6@sm" data-category="drinks" style="display: none;">
            <figure class="card__img-wrapper">
                <img src="<?= URLROOT . $drink->productPath ?>" alt="">
            </figure>
            <div class="padding-xs">
                <input type="hidden" value="<?= $drink->productId ?>">
                <h4><?= $drink->productname; ?></h4>
                <p class="margin-top-xs margin-bottom-sm text-sm color-contrast-medium line-height-md">
                    €<?= $drink->productPrice ?></p>
                <button class="btn btn--primary text-sm width-100% addToCartBtn">Add To Cart</button>
                <input type="hidden" class="productId" value="<?=$drink->productId ?>">
                <input type="hidden" class="productname" value="<?=$drink->productname ?>">
                <input type="hidden" class="productPrice" value="<?=$drink->productPrice ?>">
                <input type="hidden" class="productPath" value="<?=$drink->productPath ?>">
            </div>
        </div>
        <?php endforeach; ?>
        <?php foreach ($data['snacks'] as $snack) : ?>
        <div class="card col-6@sm" data-category="snacks" style="display: none;">
            <figure class="card__img-wrapper">
                <img src="<?= URLROOT . $snack->productPath ?>" alt="">
            </figure>
            <div class="padding-xs">
                <input type="hidden" value="<?= $snack->productId ?>">
                <h4><?= $snack->productname; ?></h4>
                <p class="margin-top-xs margin-bottom-sm text-sm color-contrast-medium line-height-md">
                    €<?= $snack->productPrice ?></p>
                <button class="btn btn--primary text-sm width-100% addToCartBtn">Add To Cart</button>
                <input type="hidden" class="productId" value="<?=$snack->productId ?>">
                <input type="hidden" class="productname" value="<?=$snack->productname ?>">
                <input type="hidden" class="productPrice" value="<?=$snack->productPrice ?>">
                <input type="hidden" class="productPath" value="<?=$snack->productPath ?>">
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</div>

<div class="drawer dr-cart js-drawer" id="drawer-cart-id">
    <div class="drawer__content bg-light inner-glow shadow-md flex flex-column" role="alertdialog"
        aria-labelledby="drawer-cart-title">
        <header
            class="flex items-center justify-between flex-shrink-0 border-bottom border-contrast-lower padding-x-sm padding-y-xs">
            <h1 id="cartcount" class="text-base text-truncate"></h1>
            <button class="reset drawer__close-btn js-drawer__close js-tab-focus">
                <svg class="icon icon--xs" viewBox="0 0 16 16">
                    <title>Close drawer panel</title>
                    <g stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"
                        stroke-miterlimit="10">
                        <line x1="13.5" y1="2.5" x2="2.5" y2="13.5"></line>
                        <line x1="2.5" y1="2.5" x2="13.5" y2="13.5"></line>
                    </g>
                </svg>
            </button>
        </header>
        <div class="drawer__body padding-x-sm padding-bottom-sm js-drawer__body">
            <ol id="selectedProductsList">
            </ol>
        </div>
        <footer class="padding-x-sm padding-y-xs border-top border-contrast-lower flex-shrink-0">
            <p class="text-sm flex justify-between" id="totalPrice"><span>Subtotal:</span> <span></span></p>
            <a href="<?= URLROOT; ?>pizzacontroller/pizzaCheckout"
                class="btn btn--primary btn--md width-100% margin-top-xs">Checkout &rarr;</a>
        </footer>
    </div>
</div>
</li>
<br>
<nav class="pagination " aria-label="Pagination">
    <ol class="pagination__list flex flex-wrap gap-xxxs justify-center">
        <li>
            <a href="#0" class="pagination__item pagination__item--disabled" aria-label="Go to previous page">
                <svg class="icon icon--xs margin-right-xxxs flip-x" viewBox="0 0 16 16">
                    <polyline points="6 2 12 8 6 14" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="2" />
                </svg>
                <span>Prev</span>
            </a>
        </li>

        <li class="display@sm">
            <a href="#0" class="pagination__item" aria-label="Go to page 1">1</a>
        </li>

        <li class="display@sm">
            <a href="#0" class="pagination__item" aria-label="Go to page 2">2</a>
        </li>

        <li class="display@sm">
            <a href="#0" class="pagination__item pagination__item--selected" aria-label="Current Page, page 3"
                aria-current="page">3</a>
        </li>

        <li class="display@sm">
            <a href="#0" class="pagination__item" aria-label="Go to page 4">4</a>
        </li>

        <li class="display@sm" aria-hidden="true">
            <span class="pagination__item pagination__item--ellipsis">...</span>
        </li>

        <li class="display@sm">
            <a href="#0" class="pagination__item" aria-label="Go to page 20">20</a>
        </li>

        <li>
            <a href="#0" class="pagination__item" aria-label="Go to next page">
                <span>Next</span>
                <svg class="icon icon--xs margin-left-xxxs" viewBox="0 0 16 16">
                    <polyline points="6 2 12 8 6 14" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="2" />
                </svg>
            </a>
        </li>
    </ol>
</nav>
<br>
<section>
    <div class="container max-width-adaptive-lg">
        <div class="margin-bottom-lg">
            <h1 class="text-center">Hear it from our customers.</h1>
        </div>
        <div class="grid gap-sm">
          <?php foreach ($data['reviews'] as $reviews) : ?>
          <div class="bg-contrast-lower bg-opacity-50% radius-md padding-md text-center flex@md flex-column@md col-4@md">
                <div class="rating rating--read-only js-rating js-rating--read-only margin-bottom-sm">
                    <p class="sr-only">The rating of this product is <span
                            class="rating__value js-rating__value"><?= $reviews->reviewRating ?></span>out of 5</p>
                    <div class="rating__control rating__control--is-hidden js-rating__control">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <polygon
                                points="12 1.489 15.09 7.751 22 8.755 17 13.629 18.18 20.511 12 17.261 5.82 20.511 7 13.629 2 8.755 8.91 7.751 12 1.489"
                                fill="currentColor" />
                        </svg>
                    </div>
                </div>
                <blockquote class="line-height-md margin-bottom-md"><?= $reviews->reviewText ?> </blockquote>
                    <cite class="text-sm">
                        <strong><?= $reviews->customerFirstName . " " . $reviews->customerLastName  ?> </strong>
                    </cite>
                </footer>
            </div>
          <?php endforeach; ?>
        </div>

    </div>
</section>
<br>
<footer class="main-footer position-relative z-index-1 padding-top-xl">
    <div class="container max-width-lg">
        <div class="grid gap-lg">
            <div class="col-3@lg order-2@lg text-right@lg">
                <a class="main-footer__logo" href="#title">
                <img class="logo-image" src="<?=URLROOT ?>public\img\logo\PIzzaLogo2.png" alt="Logo Image">
                </a>
            </div>

            <nav class="col-9@lg order-1@lg">
                <ul class="grid gap-lg">
                    <li class="col-6@xs col-3@md">
                        <h4 class="margin-bottom-sm text-base@md">Product</h4>
                        <ul class="grid gap-xs text-sm@md">
                            <li><a href="#0" class="main-footer__link">Pricing</a></li>
                            <li><a href="#0" class="main-footer__link">Teams</a></li>
                            <li><a href="#0" class="main-footer__link">Updates</a></li>
                            <li><a href="#0" class="main-footer__link">Features</a></li>
                            <li><a href="#0" class="main-footer__link">Integrations</a></li>
                            <li><a href="#0" class="main-footer__link">Support</a></li>
                        </ul>
                    </li>

                    <li class="col-6@xs col-3@md">
                        <h4 class="margin-bottom-sm text-base@md">Developers</h4>
                        <ul class="grid gap-xs text-sm@md">
                            <li><a href="#0" class="main-footer__link">Documentation</a></li>
                            <li><a href="#0" class="main-footer__link">API reference</a></li>
                            <li><a href="#0" class="main-footer__link">API status</a></li>
                            <li><a href="#0" class="main-footer__link">Open source</a></li>
                        </ul>
                    </li>

                    <li class="col-6@xs col-3@md">
                        <h4 class="margin-bottom-sm text-base@md">Resources</h4>
                        <ul class="grid gap-xs text-sm@md">
                            <li><a href="#0" class="main-footer__link">Tutorials</a></li>
                            <li><a href="#0" class="main-footer__link">Docs</a></li>
                            <li><a href="#0" class="main-footer__link">Community</a></li>
                            <li><a href="#0" class="main-footer__link">Case studies</a></li>
                            <li><a href="#0" class="main-footer__link">Help center</a></li>
                        </ul>
                    </li>

                    <li class="col-6@xs col-3@md">
                        <h4 class="margin-bottom-sm text-base@md">About</h4>
                        <ul class="grid gap-xs text-sm@md">
                            <li><a href="#0" class="main-footer__link">Company</a></li>
                            <li><a href="#0" class="main-footer__link">Customers</a></li>
                            <li><a href="#0" class="main-footer__link">Careers</a></li>
                            <li><a href="#0" class="main-footer__link">Education</a></li>
                            <li><a href="#0" class="main-footer__link">Our story</a></li>
                            <li><a href="#0" class="main-footer__link">Press kit</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>

        <div
            class="flex flex-column border-top padding-y-xs margin-top-lg flex-row@md justify-between@md items-center@md">
            <div class="margin-bottom-sm margin-bottom-0@md">
                <div class="text-sm text-xs@md color-contrast-medium flex flex-wrap gap-xs">
                    <a href="#0" class="color-contrast-high">Terms</a>
                    <a href="#0" class="color-contrast-high">Privacy</a>
                </div>
            </div>

            <div class="flex items-center gap-xs">
                <a href="#0" class="main-footer__social">
                    <svg class="icon block" viewBox="0 0 16 16">
                        <title>Follow us on Twitter</title>
                        <g>
                            <path
                                d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z">
                            </path>
                        </g>
                    </svg>
                </a>

                <a href="#0" class="main-footer__social">
                    <svg class="icon block" viewBox="0 0 16 16">
                        <title>Follow us on Youtube</title>
                        <g>
                            <path
                                d="M15.8,4.8c-0.2-1.3-0.8-2.2-2.2-2.4C11.4,2,8,2,8,2S4.6,2,2.4,2.4C1,2.6,0.3,3.5,0.2,4.8C0,6.1,0,8,0,8 s0,1.9,0.2,3.2c0.2,1.3,0.8,2.2,2.2,2.4C4.6,14,8,14,8,14s3.4,0,5.6-0.4c1.4-0.3,2-1.1,2.2-2.4C16,9.9,16,8,16,8S16,6.1,15.8,4.8z M6,11V5l5,3L6,11z">
                            </path>
                        </g>
                    </svg>
                </a>

                <a href="#0" class="main-footer__social">
                    <svg class="icon block" viewBox="0 0 16 16">
                        <title>Follow us on Github</title>
                        <g>
                            <path
                                d="M8,0.2c-4.4,0-8,3.6-8,8c0,3.5,2.3,6.5,5.5,7.6 C5.9,15.9,6,15.6,6,15.4c0-0.2,0-0.7,0-1.4C3.8,14.5,3.3,13,3.3,13c-0.4-0.9-0.9-1.2-0.9-1.2c-0.7-0.5,0.1-0.5,0.1-0.5 c0.8,0.1,1.2,0.8,1.2,0.8C4.4,13.4,5.6,13,6,12.8c0.1-0.5,0.3-0.9,0.5-1.1c-1.8-0.2-3.6-0.9-3.6-4c0-0.9,0.3-1.6,0.8-2.1 c-0.1-0.2-0.4-1,0.1-2.1c0,0,0.7-0.2,2.2,0.8c0.6-0.2,1.3-0.3,2-0.3c0.7,0,1.4,0.1,2,0.3c1.5-1,2.2-0.8,2.2-0.8 c0.4,1.1,0.2,1.9,0.1,2.1c0.5,0.6,0.8,1.3,0.8,2.1c0,3.1-1.9,3.7-3.7,3.9C9.7,12,10,12.5,10,13.2c0,1.1,0,1.9,0,2.2 c0,0.2,0.1,0.5,0.6,0.4c3.2-1.1,5.5-4.1,5.5-7.6C16,3.8,12.4,0.2,8,0.2z">
                            </path>
                        </g>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</footer>
<script src="<?= URLROOT ?>public\js\app.js"></script>
<?php require APPROOT . '/views/includes/footer.php'; ?>