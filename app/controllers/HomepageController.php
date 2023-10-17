<?php
Class HomepageController extends Controller
{
  public function index()
  {
    $data = [
      'title' => "Pizza's"
    ];
    $this->view('pizzaxl/homepage', $data);
  }
}