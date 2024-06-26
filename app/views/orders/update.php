<?php require APPROOT . '/views/includes/head.php'; ?>
<div class="app-ui js-app-ui">
    <!-- header -->
    <header class="app-ui__header shadow-xs padding-x-md padding-x-0@md">
        <div class="app-ui__logo-wrapper padding-x-sm@md">
            <a href="index.html" class="app-ui__logo">
                <svg width="104" height="30" viewBox="0 0 104 30" fill="var(--color-contrast-higher)">
                    <title>Go to homepage</title>
                    <circle cx="15" cy="15" r="15" fill="var(--color-contrast-lower)" opacity="0.5" />
                    <path
                        d="M36.184,6.145h4.551l4.807,11.727h.2L50.553,6.145H55.1V23.6H51.525V12.239h-.146L46.862,23.514H44.425L39.908,12.2h-.145V23.6H36.184Z" />
                    <path
                        d="M61.8,23.846c-3.556,0-4.347-2.234-4.347-3.9a3.405,3.405,0,0,1,2.5-3.524c1.371-.521,3.771-.56,4.854-.866.485-.136.732-.377.732-.869,0-.555-.191-1.695-1.942-1.695A2.187,2.187,0,0,0,61.274,14.5l-3.357-.273c.249-1.193,1.349-3.886,5.7-3.886,2.913,0,4.257,1.246,4.778,1.9a3.944,3.944,0,0,1,.779,2.536V23.6H65.731V21.784h-.1A3.986,3.986,0,0,1,61.8,23.846Zm1.04-2.5a2.543,2.543,0,0,0,2.727-2.42v-1.39a8.013,8.013,0,0,1-2.523.589c-.637.079-2.122.351-2.122,1.7C60.925,21.035,62.059,21.341,62.843,21.341Z" />
                    <path
                        d="M72,23.6V10.509h3.52v2.284h.136a3.513,3.513,0,0,1,1.2-1.845,3.867,3.867,0,0,1,3.084-.5v3.222c-.169-.057-2.266-.7-3.523.558a2.657,2.657,0,0,0-.789,1.964V23.6Z" />
                    <path
                        d="M89.425,10.509v2.726H86.962v6.342a1.307,1.307,0,0,0,.341,1.014,2.092,2.092,0,0,0,1.789.145l.571,2.7c-.182.057-3.132,1-5.143-.515a3.348,3.348,0,0,1-1.189-2.869V13.235h-1.79V10.509h1.79V7.372h3.631v3.137Z" />
                    <path
                        d="M97.615,23.855A6,6,0,0,1,91.9,20.7a7.7,7.7,0,0,1-.783-3.583c0-2.22,1-6.776,6.349-6.776,5.7,0,6.153,5.165,6.153,6.647v1H94.709v.008a2.864,2.864,0,0,0,2.966,3.154,2.41,2.41,0,0,0,2.513-1.517l3.359.221C103.291,21.065,102.094,23.855,97.615,23.855Zm-2.906-8.122h5.5a2.576,2.576,0,0,0-2.677-2.685A2.772,2.772,0,0,0,94.709,15.733Z" />
                    <path d="M25.607,4.393,4.393,25.607A15,15,0,0,0,25.607,4.393Z" />
                </svg>
            </a>
        </div>

        <!-- (mobile-only) menu button -->
        <button class="reset app-ui__menu-btn hide@md js-app-ui__menu-btn js-tab-focus" aria-label="Toggle menu"
            aria-controls="app-ui-navigation">
            <svg class="icon" viewBox="0 0 24 24">
                <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10"
                    stroke-width="2">
                    <path d="M1 6h22" />
                    <path d="M1 12h22" />
                    <path d="M1 18h22" />
                </g>
            </svg>
        </button>

        <!-- (desktop-only) header menu -->
        <div class="display@md flex flex-grow height-100% items-center justify-between padding-x-sm">
            <form class="expandable-search text-sm@md js-expandable-search">
                <label class="sr-only" for="expandable-search">Search</label>
                <input class="reset expandable-search__input js-expandable-search__input" type="search"
                    name="expandable-search" id="expandable-search" placeholder="Search...">
                <button class="reset expandable-search__btn">
                    <svg class="icon" viewBox="0 0 20 20">
                        <title>Search</title>
                        <g fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2">
                            <circle cx="8" cy="8" r="6" />
                            <line x1="12.243" y1="12.243" x2="18" y2="18" />
                        </g>
                    </svg>
                </button>
            </form>

            <div class="flex gap-xxxxs">
                <button class="reset app-ui__header-btn js-tab-focus" aria-controls="notifications-popover">
                    <svg class="icon" viewBox="0 0 20 20">
                        <title>Notifications</title>
                        <path d="M16,12V7a6,6,0,0,0-6-6h0A6,6,0,0,0,4,7v5L2,16H18Z" fill="none" stroke="currentColor"
                            stroke-miterlimit="10" stroke-width="2" />
                        <path d="M7.184,18a2.982,2.982,0,0,0,5.632,0Z" />
                    </svg>

                    <span class="app-ui__notification-indicator"><i class="sr-only">You have 6 notifications</i></span>
                </button>

                <a class="app-ui__header-btn js-tab-focus" href="settings.html">
                    <svg class="icon" viewBox="0 0 20 20">
                        <title>Settings</title>
                        <g fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10"
                            stroke-width="2">
                            <line x1="3" y1="10" x2="2" y2="10" />
                            <line x1="18" y1="10" x2="7" y2="10" />
                            <line x1="7" y1="12" x2="7" y2="8" />
                            <line x1="17" y1="4" x2="18" y2="4" />
                            <line x1="2" y1="4" x2="13" y2="4" />
                            <line x1="13" y1="2" x2="13" y2="6" />
                            <line x1="17" y1="16" x2="18" y2="16" />
                            <line x1="2" y1="16" x2="13" y2="16" />
                            <line x1="13" y1="14" x2="13" y2="18" />
                        </g>
                    </svg>
                </a>

                <div class="dropdown inline-block js-dropdown">
                    <div class="dropdown__wrapper">
                        <a class="app-ui__user-btn js-dropdown__trigger js-tab-focus" href="settings.html">
                            <img src="assets/img/author-img-1.jpg" alt="Author picture">
                        </a>

                        <ul class="dropdown__menu js-dropdown__menu" aria-label="dropdown">
                            <li>
                                <a class="dropdown__item" href="settings.html">Settings</a>
                            </li>

                            <li>
                                <a class="dropdown__item" href="settings-password.html">Password</a>
                            </li>

                            <li>
                                <a class="dropdown__item" href="settings-notifications.html">Notifications</a>
                            </li>

                            <hr class="dropdown__separator" role="separator">

                            <li>
                                <a class="dropdown__item" href="#0">Log Out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- navigation -->
    <div class="app-ui__nav js-app-ui__nav" id="app-ui-navigation">
        <div class="flex flex-column height-100%">
            <div class="flex-grow overflow-auto momentum-scrolling">
                <!-- (mobile-only) search -->
                <div class="padding-x-md padding-top-md hide@md">
                    <div class="search-input search-input--icon-right">
                        <input class="form-control width-100% height-100%" type="search" name="searchInputX"
                            id="searchInputX" placeholder="Search..." aria-label="Search">
                        <button class="search-input__btn">
                            <svg class="icon" viewBox="0 0 24 24">
                                <title>Submit</title>
                                <g stroke-linecap="square" stroke-linejoin="miter" stroke-width="2"
                                    stroke="currentColor" fill="none" stroke-miterlimit="10">
                                    <line x1="22" y1="22" x2="15.656" y2="15.656"></line>
                                    <circle cx="10" cy="10" r="8"></circle>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>

                <nav class="sidenav padding-y-sm js-sidenav">
                    <div class="sidenav__label margin-bottom-xxxs">
                        <span class="text-sm color-contrast-medium text-xs@md">Main</span>
                    </div>

                    <ul class="sidenav__list">
                        <li class="sidenav__item">
                            <a href="index.html" class="sidenav__link">
                                <svg class="icon sidenav__icon" aria-hidden="true" viewBox="0 0 16 16">
                                    <g>
                                        <path
                                            d="M6,0H1C0.4,0,0,0.4,0,1v5c0,0.6,0.4,1,1,1h5c0.6,0,1-0.4,1-1V1C7,0.4,6.6,0,6,0z M5,5H2V2h3V5z">
                                        </path>
                                        <path
                                            d="M15,0h-5C9.4,0,9,0.4,9,1v5c0,0.6,0.4,1,1,1h5c0.6,0,1-0.4,1-1V1C16,0.4,15.6,0,15,0z M14,5h-3V2h3V5z">
                                        </path>
                                        <path
                                            d="M6,9H1c-0.6,0-1,0.4-1,1v5c0,0.6,0.4,1,1,1h5c0.6,0,1-0.4,1-1v-5C7,9.4,6.6,9,6,9z M5,14H2v-3h3V14z">
                                        </path>
                                        <path
                                            d="M15,9h-5c-0.6,0-1,0.4-1,1v5c0,0.6,0.4,1,1,1h5c0.6,0,1-0.4,1-1v-5C16,9.4,15.6,9,15,9z M14,14h-3v-3h3V14z">
                                        </path>
                                    </g>
                                </svg>
                                <span class="sidenav__text text-sm@md">Dashboard</span>

                                <span class="sidenav__counter">12 <i class="sr-only">notifications</i></span>
                            </a>
                        </li>

                        <li class="sidenav__item">
                            <a href="components.html" class="sidenav__link">
                                <svg class="icon sidenav__icon" aria-hidden="true" viewBox="0 0 16 16">
                                    <g>
                                        <circle cx="13" cy="5" r="3"></circle>
                                        <rect x="3" y="8" width="7" height="7" rx="1" ry="1"></rect>
                                        <polygon points="4 0 0 6 8 6 4 0"></polygon>
                                    </g>
                                </svg>
                                <span class="sidenav__text text-sm@md">Components</span>
                            </a>

                            <button class="reset sidenav__sublist-control js-sidenav__sublist-control js-tab-focus"
                                aria-label="Toggle sub navigation">
                                <svg class="icon" viewBox="0 0 12 12">
                                    <polygon points="4 3 8 6 4 9 4 3" />
                                </svg>
                            </button>

                            <ul class="sidenav__list">
                                <li class="sidenav__item">
                                    <a href="components-charts.html" class="sidenav__link">
                                        <span class="sidenav__text text-sm@md">Charts</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="components-tables.html" class="sidenav__link">
                                        <span class="sidenav__text text-sm@md">Tables</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="components-cards.html" class="sidenav__link">
                                        <span class="sidenav__text text-sm@md">Cards</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="components-buttons.html" class="sidenav__link">
                                        <span class="sidenav__text text-sm@md">Buttons</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="components-forms.html" class="sidenav__link">
                                        <span class="sidenav__text text-sm@md">Forms</span>
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li class="sidenav__item sidenav__item--expanded">
                            <a href="pages.html" class="sidenav__link">
                                <svg class="icon sidenav__icon" aria-hidden="true" viewBox="0 0 16 16">
                                    <g>
                                        <path
                                            d="M14,0H2C1.4,0,1,0.4,1,1v14c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1V1C15,0.4,14.6,0,14,0z M13,14H3V2h10V14z">
                                        </path>
                                        <rect x="4" y="3" width="4" height="4"></rect>
                                        <rect x="9" y="4" width="3" height="1"></rect>
                                        <rect x="9" y="6" width="3" height="1"></rect>
                                        <rect x="4" y="8" width="8" height="1"></rect>
                                        <rect x="4" y="10" width="8" height="1"></rect>
                                        <rect x="4" y="12" width="5" height="1"></rect>
                                    </g>
                                </svg>

                                <span class="sidenav__text text-sm@md">Pages</span>
                            </a>

                            <button class="reset sidenav__sublist-control js-sidenav__sublist-control js-tab-focus"
                                aria-label="Toggle sub navigation">
                                <svg class="icon" viewBox="0 0 12 12">
                                    <polygon points="4 3 8 6 4 9 4 3" />
                                </svg>
                            </button>

                            <ul class="sidenav__list">
                                <li class="sidenav__item">
                                    <a href="<?=URLROOT?>/Employee/overview/" class="sidenav__link">
                                        <span class="sidenav__text text-sm@md">Employees</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="<?=URLROOT?>/Ingredient/overview/" class="sidenav__link">
                                        <span class="sidenav__text text-sm@md">Ingredients</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="<?=URLROOT?>/Order/overview/" class="sidenav__link" aria-current="page">
                                        <span class="sidenav__text text-sm@md">Orders</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="<?=URLROOT?>/Customer/overview/" class="sidenav__link" >
                                        <span class="sidenav__text text-sm@md">Customers</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="<?=URLROOT?>/Product/overview/" class="sidenav__link" >
                                        <span class="sidenav__text text-sm@md">Products</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="<?=URLROOT?>/Promotion/overview/" class="sidenav__link" >
                                        <span class="sidenav__text text-sm@md">Promotions</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="<?=URLROOT?>/Review/overview/" class="sidenav__link" >
                                        <span class="sidenav__text text-sm@md">Reviews</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="<?=URLROOT?>/Store/overview/" class="sidenav__link" >
                                        <span class="sidenav__text text-sm@md">Stores</span>
                                    </a>
                                </li>

                                <li class="sidenav__item">
                                    <a href="<?=URLROOT?>/Vehicle/overview/" class="sidenav__link" >
                                        <span class="sidenav__text text-sm@md">Vehicles</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <div class="sidenav__divider margin-y-xs" role="presentation"></div>

                    <div class="sidenav__label margin-bottom-xxxs">
                        <span class="text-sm color-contrast-medium text-xs@md">Other</span>
                    </div>

                    <ul class="sidenav__list">
                        <li class="sidenav__item">
                            <a href="settings.html" class="sidenav__link">
                                <svg class="icon sidenav__icon" aria-hidden="true" viewBox="0 0 16 16">
                                    <g>
                                        <circle cx="6" cy="8" r="2"></circle>
                                        <path
                                            d="M10,2H6C2.7,2,0,4.7,0,8s2.7,6,6,6h4c3.3,0,6-2.7,6-6S13.3,2,10,2z M10,12H6c-2.2,0-4-1.8-4-4s1.8-4,4-4h4 c2.2,0,4,1.8,4,4S12.2,12,10,12z">
                                        </path>
                                    </g>
                                </svg>
                                <span class="sidenav__text text-sm@md">Settings</span>
                            </a>
                        </li>

                        <li class="sidenav__item">
                            <a href="notifications.html" class="sidenav__link">
                                <svg class="icon sidenav__icon" aria-hidden="true" viewBox="0 0 16 16">
                                    <g>
                                        <path d="M10,14H6c0,1.1,0.9,2,2,2S10,15.1,10,14z"></path>
                                        <path
                                            d="M15,11h-0.5C13.8,10.3,13,9.3,13,8V5c0-2.8-2.2-5-5-5S3,2.2,3,5v3c0,1.3-0.8,2.3-1.5,3H1c-0.6,0-1,0.4-1,1 s0.4,1,1,1h14c0.6,0,1-0.4,1-1S15.6,11,15,11z">
                                        </path>
                                    </g>
                                </svg>

                                <span class="sidenav__text text-sm@md">Notifications</span>
                                <span class="sidenav__counter">23 <i class="sr-only">notifications</i></span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <!-- light/dark mode toggle -->
            <div class="padding-md padding-sm@md margin-top-auto flex-shrink-0 border-top border-alpha">
                <div class="flex items-center justify-between@md">
                    <p class="text-sm@md">Dark Mode</p>

                    <div class="switch dark-mode-switch margin-left-xxs">
                        <input class="switch__input" type="checkbox" id="switch-light-dark">
                        <label aria-hidden="true" class="switch__label" for="switch-light-dark">On</label>
                        <div aria-hidden="true" class="switch__marker"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- main content -->
    <main class="app-ui__body padding-md js-app-ui__body">
        <div class="margin-bottom-md">
            <h1 class="text-lg"><?= $data['StoreName']; ?></h1>
        </div>

        <div class="margin-bottom-md">
            <nav class="breadcrumbs text-sm" aria-label="Breadcrumbs">
                <ol class="flex flex-wrap gap-xxs">
                    <li class="breadcrumbs__item">
                        <a href="<?= URLROOT?>/Order/overview" class="color-inherit">All Products</a>
                        <span class="color-contrast-low margin-left-xxs"
                            aria-hidden="true"><?= $data['order']->orderId; ?></span>
                    </li>

                    <li class="breadcrumbs__item"></li>
                </ol>
            </nav>
        </div>

        <div class="bg radius-md shadow-xs">
            <form action="<?= URLROOT; ?>/Order/update" method="post">
                <div class="padding-md">
                    <!-- basic form controls -->
                    <fieldset class="margin-bottom-xl">
                        <legend class="form-legend margin-bottom-md">Order</legend>

                        <!-- ID -->
                        <div class="margin-bottom-sm">
                            <div class="grid gap-xxs">
                                <div class="col-6@lg">
                                    <input class="form-control width-100%" type="hidden" name="id" id="id"
                                        value="<?= $data['order']->orderId; ?>">
                                </div>
                            </div>
                        </div>
                        <div class="margin-bottom-sm">
                            <div class="grid gap-xxs">
                                <div class="col-3@lg">
                                    <label class="inline-block text-sm padding-top-xs@lg" for="orderState">State</label>
                                </div>
                                <div class="col-6@lg">
                                    <div class="select">
                                        <select class="select__input form-control" name="orderState" id="orderState">
                                        <?php foreach ($data['orderState'] as $value => $name ) : ?>
                                            <option <?= ($data['order']->orderState == $value) ? "selected" : "" ?> value="<?= $value ?>"><?= $name ?></option>
                                            <?php endforeach ?>
                                        </select>
                                            
                                        <svg class="icon select__icon" aria-hidden="true" viewBox="0 0 16 16">
                                            <polyline points="1 5 8 12 15 5" fill="none" stroke="currentColor"
                                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="margin-bottom-sm">
                            <div class="grid gap-xxs">
                                <div class="col-3@lg">
                                    <label class="inline-block text-sm padding-top-xs@lg" for="orderStatus">Status</label>
                                </div>
                                <div class="col-6@lg">
                                    <div class="select">
                                        <select class="select__input form-control" name="orderStatus" id="orderStatus">
                                        <?php foreach ($data['orderStatus'] as $value => $name ) : ?>
                                            <option <?= ($data['order']->orderStatus == $value) ? "selected" : "" ?> value="<?= $value ?>"><?= $name ?></option>
                                            <?php endforeach ?>
                                        </select>

                                        <svg class="icon select__icon" aria-hidden="true" viewBox="0 0 16 16">
                                            <polyline points="1 5 8 12 15 5" fill="none" stroke="currentColor"
                                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div class="border-top border-alpha padding-md">
                    <div class="flex flex-wrap gap-xs justify-between">
                        <button class="btn btn--primary">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </main>
</div>

<!-- dialog -->
<div class="dialog dialog--sticky js-dialog" id="dialog-delete-user-confirmation" data-animation="on">
    <div class="dialog__content max-width-xxs" role="alertdialog" aria-labelledby="dialog-title-1"
        aria-describedby="dialog-description">
        <div class="text-component">
            <h4 id="dialog-title-1">Are you sure you want to delete this user?</h4>
            <p id="dialog-description">This action cannot be undone.</p>
        </div>

        <footer class="margin-top-md">
            <div class="flex justify-end gap-xs flex-wrap">
                <button class="btn btn--subtle js-dialog__close">Cancel</button>
                <button class="btn btn--accent">Delete</button>
            </div>
        </footer>
    </div>
</div>

<!-- notification popover -->
<div id="notifications-popover" class="popover notif-popover bg radius-md shadow-md js-popover" role="dialog">
    <header class="bg bg-opacity-90% backdrop-blur-10 text-sm padding-sm shadow-xs position-sticky top-0 z-index-2">
        <div class="flex justify-between items-baseline">
            <h1 class="text-md">Notifications</h1>
            <a href="notifications.html" class="js-tab-focus">View all</a>
        </div>
    </header>

    <ul class="notif text-sm">
        <li class="notif__item ">
            <a class="notif__link flex padding-sm" href="#0">
                <figure class="notif__figure margin-right-xs color-primary" aria-hidden="true">
                    <img src="assets/img/table-v2-img-1.jpg" alt="user picture">
                </figure>

                <div class="flex-grow margin-right-xs">
                    <div>
                        <p><i class="font-semibold">Olivia Saturday</i> commented on your <i class="font-semibold">"This
                                is all it takes to improve..."</i> post.</p>
                        <p class="text-sm color-contrast-medium margin-top-xxxs"><time>1 hour ago</time></p>
                    </div>
                </div>

                <div class="notif__dot margin-left-auto" aria-hidden="true"></div>
            </a>
        </li>

        <li class="notif__item ">
            <a class="notif__link flex padding-sm" href="#0">
                <figure class="notif__figure margin-right-xs color-accent" aria-hidden="true">
                    <img src="assets/img/table-v2-img-2.jpg" alt="user picture">
                </figure>

                <div class="flex-grow margin-right-xs">
                    <div>
                        <p>It's <i class="font-semibold">David Smith</i>'s birthday. Wish him well!</p>
                        <p class="text-sm color-contrast-medium margin-top-xxxs"><time>12 hours ago</time></p>
                    </div>
                </div>

                <div class="notif__dot margin-left-auto" aria-hidden="true"></div>
            </a>
        </li>

        <li class="notif__item ">
            <a class="notif__link flex padding-sm" href="#0">
                <figure class="notif__figure margin-right-xs color-primary" aria-hidden="true">
                    <img src="assets/img/table-v2-img-3.jpg" alt="user picture">
                </figure>

                <div class="flex-grow margin-right-xs">
                    <div>
                        <p><i class="font-semibold">Marta Rossi</i> posted <i class="font-semibold">"10 helpful tips to
                                learn web design"</i>.</p>
                        <p class="text-sm color-contrast-medium margin-top-xxxs"><time>a day ago</time></p>

                        <div class="bg radius-md padding-sm shadow-sm margin-top-sm">
                            <p class="color-contrast-medium line-height-lg">Lorem ipsum dolor sit amet consectetur,
                                adipisicing elit. Harum beatae commodi quibusdam officiis...</p>
                        </div>
                    </div>
                </div>
            </a>
        </li>
    </ul>
</div>
<?php require APPROOT . '/views/includes/footer.php'; ?>