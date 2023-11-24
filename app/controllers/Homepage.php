<?php
Class Homepage extends Controller
{

  private $HomepageModel;

  public function __construct()
  {
    $this->HomepageModel = $this->model('HomepageModel');
  }


  public function index() {
    
      $promos = $this->HomepageModel->getPromos();
      $pizza = $this->HomepageModel->getPizzas();
      $drinks = $this->HomepageModel->getDrinks();
      $snacks = $this->HomepageModel->getSnacks();
      $reviews = $this->HomepageModel->getReviews();
      $data = [
          'title' => "PizzaXXL",
          'promos' => $promos,
          'pizza' => $pizza,
          'drinks' => $drinks,
          'snacks' => $snacks,
          'reviews' => $reviews

      ];
      $this->view('pizzaxxl/homepage', $data);
  }
}
