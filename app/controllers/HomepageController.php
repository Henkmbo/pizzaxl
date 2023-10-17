<?php
Class HomepageController extends Controller
{
  public function index()
  {
    $data = [
      'title' => "PizzaXL"
    ];
    $this->view('pizzaxl/homepage', $data);
  }
}