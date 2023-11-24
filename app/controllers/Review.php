<?php
Class Review extends Controller
{

  private $ReviewModel;
  private $CustomerModel;
  private $OrderModel;
  private $ProductModel;
  private $StoreModel;
  private $ScreenModel;


  public function __construct()
  {
    $this->ReviewModel = $this->model('ReviewModel');
    $this->CustomerModel = $this->model('CustomerModel');
    $this->OrderModel = $this->model('OrderModel');
    $this->ProductModel = $this->model('ProductModel');
    $this->StoreModel = $this->model('StoreModel');
    $this->ScreenModel = $this->model('ScreenModel');
  }


  public function overview($page = 1) {
    
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $perPage = 1; 
    $reviews = $this->ReviewModel->getReviews($page, $perPage);
    $totalReviews = $this->ReviewModel->getTotalActiveReviews(); 

    Helper::log('error', 'dit is faya');
    $data = [
          'title' => 'reviews',
          'reviews' => $reviews,
          'totalReviews' => $totalReviews,
          'currentPage' => $page,
            'perPage' => $perPage,

      ];
      $this->view('reviews/overview', $data);
  }
  public function create()
  {
      if ($_SERVER['REQUEST_METHOD'] == 'POST') {
          $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
          $this->ReviewModel->create($post);
          $toast = urlencode('true');
          $toasttitle = urlencode('Succes');
          $toastmessage = urlencode('Your create of the Review was successfull');
          header('Location:' . URLROOT . 'Review/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
} else {
          $customers = $this->CustomerModel->getCustomers();
          $orders = $this->OrderModel->getOrders();
          $products = $this->ProductModel->getproducts();
          $stores = $this->StoreModel->getStores();
          $data = [
              'title' => 'Create review',
              'customers' => $customers,
              'orders' => $orders,
              'products' => $products,
              'stores' => $stores
          ];
          $this->view('reviews/create', $data);
      }
  }

  public function update($reviewId = null)
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Process the form submission
            $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $this->ReviewModel->update($post);
            header('Location:' . URLROOT . 'Review/overview/{toast:true;toasttitle:Success;toastmessage:Your+update+of+the+Review+was+successful}');
        } else {
            // Display the form
            $reviews = $this->ReviewModel->getSingleReview($reviewId);
            $images = $this->ScreenModel->getScreensDataById($reviewId, 'review');
            if ($images !== false) {
                // Check if the necessary properties exist before accessing them
                foreach ($images as $image) :
                    if (property_exists($image, 'screenCreateDate') && property_exists($image, 'screenId')) {
                        $createDate = date('Ymd', $image->screenCreateDate);
                        $image->imagePath = URLROOT . 'public/media/' . $createDate . '/' . $image->screenId . '.jpg';
                    } else {
                        // Handle the case where expected properties are missing
                        $image->imagePath = URLROOT . 'public/default-image.jpg';
                    }
                endforeach;
            }
            // Helper::dump($images); exit;


            $data = [
                'title' => '<h3>Update reviews</h3>',
                'reviews' => $reviews,
                'images' => $images
            ];

            $this->view('reviews/update', $data);
        }
    }

  public function updateImage($reviewId)
  {
      $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
      global $var;
      $screenId = $var['rand'];
      
      // Ensure that the imageUploader function returns an array
      $imageUploaderResult = $this->imageUploader($screenId);
      
      if (is_array($imageUploaderResult) && isset($imageUploaderResult['status'])) {
          if ($imageUploaderResult['status'] === 200 && strpos($imageUploaderResult['message'], 'Image uploaded successfully') !== false) {
              $entity = 'review';
              $this->ScreenModel->insertScreenImagesScope($screenId, $reviewId, $entity, $post);
              header('Location:' . URLROOT . 'Review/update/' . $reviewId . '/{toast:true;toasttitle:Success;toastmessage:Your+create+of+the+Review+was+successful}');
          } else {
              Helper::log('error', $imageUploaderResult);
              header('Location:' . URLROOT . 'Review/update/' . $reviewId . '/{toast:true;toasttitle:Error;toastmessage:Review+upload+failed}');
          }
      } else {
          // Handle the case where $imageUploaderResult is not an array
          Helper::log('error', 'Invalid response from imageUploader function');
          header('Location:' . URLROOT . 'Review/update/' . $reviewId . '/{toast:true;toasttitle:Error;toastmessage:Image+upload+failed}');
      }
  }
  
  
      public function deleteImage($ids)
      {
          $ids = explode("+", $ids);
          if ($this->ScreenModel->deleteScreen($ids[0])) {
              header('Location:' . URLROOT . 'Review/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Review+was+successful}');
  
          } else {
              header('Location:' . URLROOT . 'Review/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Review+has+failed}');
  
          }
      }
 
      public function delete($reviewId)
      {
        if ($this->ReviewModel->delete($reviewId)) {
            header('Location:' . URLROOT . 'Review/overview/{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Review+was+successful}');
  
          } else {
            header('Location:' . URLROOT . 'Review/overview/{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Review+was+successful}');
  
          }
      }
}



