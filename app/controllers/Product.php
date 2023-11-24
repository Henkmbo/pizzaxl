<?php
Class Product extends Controller
{

  private $ProductModel;
  private $CustomerModel;
  private $screenModel;


  public function __construct()
  {
    $this->ProductModel = $this->model('ProductModel');
    $this->CustomerModel = $this->model('CustomerModel');
    $this->screenModel = $this->model('ScreenModel');
  }


  public function overview($page = 1) {
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $perPage = 1; 
    $products = $this->ProductModel->getProducts($page, $perPage);
    $totalProducts= $this->ProductModel->getTotalActiveProducts(); // Add a method to get the total count

    $data = [
          'title' => 'products',
          'products' => $products,
          'activeproducts' => $totalProducts,
          'currentPage' => $page,
          'perPage' => $perPage,

      ];
      $this->view('products/overview', $data);
  }



  public function update($productId = null)
  {
      if ($_SERVER['REQUEST_METHOD'] == 'POST') {
          // Process the form submission
          $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
          $result = $this->ProductModel->update($post);
  
          if ($result) {
              // Form submission was successful
              $toast = urlencode('true');
              $toasttitle = urlencode('Success');
              $toastmessage = urlencode('Your update of the Product was successful');
          } else {
              // Form submission failed
              $toast = urlencode('false');
              $toasttitle = urlencode('Failed');
              $toastmessage = urlencode('Your update of the Product has failed');
          }
  
          // Redirect with feedback parameters
          header('Location:' . URLROOT . 'Product/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
      } else {
          // Display the form
          global $productType;
          $product = $this->ProductModel->getSingleProduct($productId);
          $customers = $this->CustomerModel->getCustomers();
          $image = $this->screenModel->getScreenDataById($productId, 'product', 'main');
          if ($image !== false) {
              // Check if the necessary properties exist before accessing them
              if (property_exists($image, 'screenCreateDate') && property_exists($image, 'screenId')) {
                  $createDate = date('Ymd', $image->screenCreateDate);
                  $imageSrc = URLROOT . 'public/media/' . $createDate . '/' . $image->screenId . '.jpg';
              } else {
                  // Handle the case where expected properties are missing
                  $imageSrc = URLROOT . 'public/default-image.jpg';
              }
          } else {
              // Handle the case where no image data is found
              $imageSrc = URLROOT . 'public/default-image.jpg';
          }
        
              $data = [
                  'title' => '<h3>Update product</h3>',
                  'product' => $product,
                  'customers' => $customers,
                  'productType' => $productType,
                  'image' => $image,
                  'imageSrc' => $imageSrc
              ];
  
              $this->view('products/update', $data);
        }

    }

    
    public function updateImage($productId)
    {
        $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        global $var;
        $screenId = $var['rand'];
        
        // Ensure that the imageUploader function returns an array
        $imageUploaderResult = $this->imageUploader($screenId);
        
        if (is_array($imageUploaderResult) && isset($imageUploaderResult['status'])) {
            if ($imageUploaderResult['status'] === 200 && strpos($imageUploaderResult['message'], 'Image uploaded successfully') !== false) {
                $entity = 'product';
                $this->screenModel->insertScreenImages($screenId, $productId, $entity, $post);
                header('Location:' . URLROOT . 'Product/update/' . $productId . '/{toast:true;toasttitle:Success;toastmessage:Your+create+of+the+Product+was+successful}');
            } else {
                Helper::log('error', $imageUploaderResult);
                header('Location:' . URLROOT . 'Product/update/' . $productId . '/{toast:true;toasttitle:Error;toastmessage:Product+upload+failed}');
            }
        } else {
            // Handle the case where $imageUploaderResult is not an array
            Helper::log('error', 'Invalid response from imageUploader function');
            header('Location:' . URLROOT . 'Product/update/' . $productId . '/{toast:true;toasttitle:Error;toastmessage:Image+upload+failed}');
        }
    }
        
    
        public function deleteImage($ids)
        {
            $ids = explode("+", $ids);
            if ($this->screenModel->deleteScreen($ids[0])) {
                header('Location:' . URLROOT . 'Product/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Product+was+successful}');
    
            } else {
                header('Location:' . URLROOT . 'Product/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Product+has+failed}');
    
            }
        }

  
  public function create()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $this->ProductModel->create($post);
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your create of the product was successfull');
            header('Location:' . URLROOT . 'Product/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
    } else {
            $customers = $this->CustomerModel->getCustomers();
            $data = [
                'title' => 'Create product',
                'customers' => $customers,

            ];
            $this->view('products/create', $data);
        }
    }




public function delete($productId) {
  if ($this->ProductModel->delete($productId)) {
    $toast = urlencode('true');
    $toasttitle = urlencode('Succes');
    $toastmessage = urlencode('Your delete of the product was successfull');
    header('Location:' . URLROOT . 'Product/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
} else {
    $toast = urlencode('true');
    $toasttitle = urlencode('Succes');
    $toastmessage = urlencode('Your delete of the product was successfull');
    header('Location:' . URLROOT . 'Product/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
}
}
}