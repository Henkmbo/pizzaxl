<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>
        document.getElementsByTagName("html")[0].className += " js";
    </script>
    <!-- font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= URLROOT; ?>/assets/css/style.css">
    <script src="<?= URLROOT; ?>assets/js/dark-mode.js"></script>
    <link rel="stylesheet" href="<?= URLROOT?>public\css\style.css">
    <title>PizzaXXl</title>
</head>
<body>
<div class="toast toast--hidden toast--top-right js-toast toast1" role="alert" aria-live="assertive" aria-atomic="true" id="toast-5">
  <div class="flex items-start justify-between">
    <div class="toast__icon-wrapper toast__icon-wrapper--success margin-right-xs">
      <svg class="icon" viewBox="0 0 16 16"><title>Success</title><g><path d="M6,15a1,1,0,0,1-.707-.293l-5-5A1,1,0,1,1,1.707,8.293L5.86,12.445,14.178.431a1,1,0,1,1,1.644,1.138l-9,13A1,1,0,0,1,6.09,15C6.06,15,6.03,15,6,15Z"></path></g></svg>
    </div>

    <div class="text-component text-sm">
      <h1 class="toast__title text-md">Title Five</h1>
      <p class="toast__p">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo esse maiores assumenda.</p>
    </div>
  
    <button class="reset toast__close-btn margin-left-xxxxs js-toast__close-btn js-tab-focus">
      <svg class="icon" viewBox="0 0 12 12"><title>Close notification</title><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" /></g></svg>
    </button>
  </div>
</div>

